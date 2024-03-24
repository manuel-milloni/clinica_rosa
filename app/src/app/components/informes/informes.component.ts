import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom, share } from 'rxjs';
import { Turno } from 'src/app/interfaces/Turno';
import { TurnoService } from 'src/app/services/turno.service';

import { Chart, ChartType } from 'chart.js/auto';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { SharedFunctions } from 'src/app/utils/SharedFunctions';

@Component({
    selector: 'app-informes',
    templateUrl: './informes.component.html',
    styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
    mostrarCalendarioFD: boolean = false;
    mostrarCalendarioFH: boolean = false;

    fechaDesde: NgbDate | undefined;
    fechaHasta: NgbDate | undefined;

    fechaDesdeInput: string | undefined;
    fechaHastaInput: string | undefined;

    fechaDesdeDB: string | undefined;
    fechaHastaDB: string | undefined;

    listTurnos: Turno[] = [];
    listTurnosLast12M: Turno[] = [];

    public lineChart: Chart | undefined;
    public barChart: Chart | undefined;
    public barChart3: Chart | undefined;

  



    constructor(private _turnoService: TurnoService,
        private toastr: ToastrService,
        private _especialidadService: EspecialidadService,
        private sharedFunctions : SharedFunctions) {

    }

    async ngOnInit(): Promise<void> {
        this.getLast12M();
        await this.getTurnosLast12M();
        this.generarArrayCantidadTurnosPorMes(this.listTurnosLast12M);
        this.initLineChart();
        this.cargaInicialGraficos();
    }

    toogleFD() {
        this.mostrarCalendarioFD = !this.mostrarCalendarioFD;
    }

    toogleFH() {
        this.mostrarCalendarioFH = !this.mostrarCalendarioFH;
    }

    seleccionarFechaDesde(event: { year: number; month: number; day: number }) {
        const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

        this.fechaDesde = fechaSeleccionada;

      

        this.fechaDesdeInput = this.sharedFunctions.formatearFechaLocal(fechaSeleccionada);

        this.fechaDesdeDB = this.sharedFunctions.formatearFecha(fechaSeleccionada);

        this.mostrarCalendarioFD = false;

    }

    seleccionarFechaHasta(event: { year: number; month: number; day: number }) {
        const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

        this.fechaHasta = fechaSeleccionada;



        this.fechaHastaInput = this.sharedFunctions.formatearFechaLocal(fechaSeleccionada);

        this.fechaHastaDB = this.sharedFunctions.formatearFecha(fechaSeleccionada);

        this.mostrarCalendarioFH = false;

    }

    async buscar() {

        if(this.validaFechas()){
            await this.getListTurnos();
            this.initGrafico2();
            await this.initGrafico3();
        }else{
            this.toastr.error('La fecha desde debe ser menor a la fecha hasta', 'Error');
        }
      


    }

        //Valido fechas ingresadas
        validaFechas() : boolean{
            if(this.fechaDesde?.year! > this.fechaHasta?.year!){
                  return false;
            } else {
                if(this.fechaDesde?.month! > this.fechaHasta?.month!){
                    return false;
                } else {
                    if(this.fechaDesde?.day! > this.fechaHasta?.day!){
                            return false;
                    }else {
                        return true;
                    }
                }
            }
        }


    //Obtiene array de turnos en el periodo indicado.
    async getListTurnos() {
     
        const body: any = {
            fechaDesde: this.fechaDesdeDB,
            fechaHasta: this.fechaHastaDB
        };

        try {
            const turnos: Turno[] = await firstValueFrom(this._turnoService.getTurnosByFecha(body));

            this.listTurnos = turnos;

          
        } catch (error) {
            console.error(error);
            this.toastr.error('Error al obtener informe de turnos', 'Error');
        }
    }






    //------------------------- LINE CHART--------------------------------------------------------------------------------------------------

    getLast12M() {

        const monthsArray: string[] = [];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();

        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(currentDate.getFullYear(), currentMonth - i);
            const monthName = monthDate.toLocaleString('default', { month: 'long' });
            monthsArray.push(monthName);
        }


        return monthsArray.reverse();
    }

      //Todos los turnos de los ultimos 12 meses.
    async getTurnosLast12M() {

        //Genero fecha Desde
        const currentDate: Date = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const elevenMonthsAgo = (currentMonth - 11 + 12) % 12;
        const elevenMonthsAgoYear = currentYear - (currentMonth < 11 ? 1 : 0); //Si estamos en Diciembre los 11 meses anteriores al actual van a estar dentro del mismo anio pero de lo contrario la fecha inicial tambien cambia de anio

        const fechaDesdeDate: NgbDate = new NgbDate(elevenMonthsAgoYear, elevenMonthsAgo + 1, 1); //Se suma uno al mes porque los meses en JS van de 0 a 11 y en NgbDate(Angular) van de 1 al 12

        const fechaActual: NgbDate = new NgbDate(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        const fechaDesde = this.sharedFunctions.formatearFecha(fechaDesdeDate);

        const fechaHasta = this.sharedFunctions.formatearFecha(fechaActual);


        const body: any = {
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta
        };

        try {
            const turnos: Turno[] = await firstValueFrom(this._turnoService.getTurnosByFecha(body));

            this.listTurnosLast12M = turnos;


        } catch (error) {
            console.error(error);
            this.toastr.error('Error al obtener informe de turnos', 'Error');
        }


    }

    initLineChart() {
        //Grafico Linea Cant turnos mensual de los ult 12 meses.

        const labelMonths: string[] = this.getLast12M();
        const data: number[] = this.generarArrayCantidadTurnosPorMes(this.listTurnosLast12M);
        const lineData = {
            labels: labelMonths,
            datasets: [{
                label: 'Turnos Mensuales de los ult 12 meses.',
                data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        this.lineChart = new Chart("lineChart", {
            type: 'line' as ChartType,
            data: lineData
        });

    }


    generarArrayCantidadTurnosPorMes(listTurnosLast12M: Turno[]) {
        const cantidadPorMes: { [mes: string]: number } = {};

        // Inicializr el objeto con 0 turnos para cada mes
        this.getLast12M().forEach(month => {
            cantidadPorMes[month] = 0;
        });

        listTurnosLast12M.forEach(turno => {
            // Convetir la fecha a un objeo Date si es un string
            const fechaTurno = typeof turno.fecha === 'string' ? new Date(turno.fecha) : turno.fecha;

            // obtener el mes (nombre)
            const mes = fechaTurno.toLocaleString('default', { month: 'long' });

            // incrementar la cantidad de turnos para el mes correspondiente
            cantidadPorMes[mes]++;
        });

        // Crear el array de cantidades de turnos en el mismo orden que el de meses
        const arrayCantidadPorMes = this.getLast12M().map(month => cantidadPorMes[month]);


        return arrayCantidadPorMes;
    }


    //Grafico lineas que muestre cantidad de turnos 'asistidos' por mes(ultimos 12 meses)
    //necesitaria que dentro de la fecha que el usuario selecciona:
    //Traiga todos los turnos en el periodo seleccionado
    // -Genere el labels de meses
    // -Genere array de cantidad de turnos para cada mes



    // ------------------------------------  GRAFICO CANT TURNOS POR ESTADO ------------------------------------------


    initGrafico2() {
        const labelEstados: string[] = ['Concretado', 'Pendiente', 'Cancelado', 'Ausente'];

        const data: number[] = labelEstados.map((estado) => {
            const cantidadTurnos = this.listTurnos.filter((turno) => turno.estado === estado).length;
            return cantidadTurnos;
        });

        const barData = {
            labels: labelEstados,
            datasets: [{
                label: 'Turnos por Estado',
                data,
                backgroundColor: [
                    'rgba(83, 162, 49, 0.7)',
                    'rgba(252, 242, 26, 0.7)',
                    'rgba(252, 149, 26, 0.7)',
                    'rgba(234, 38, 26, 0.7)'
                ],
                fill: false,
                borderColor: [
                    'rgba(255, 255, 255)',
                    'rgba(255, 159, 64)',
                    'rgba(255, 205, 86)',
                    'rgba(255, 192, 192)'
                ],
                tension: 0.1
            }]
        };

        // Destruir el grafico existente
        if (this.barChart) {
            this.barChart.destroy();
        }

        this.barChart = new Chart("barChart", {
            type: 'bar' as ChartType,
            data: barData
        });
    }


    //-------------------------GRAFICO PORCENTAJE DE TURNOS POR ESPECIALIDAD--------------------------------------

    async initGrafico3() {

        //Obtengo turnos
        const turnos = await this.getTurnosG3();


        //Genero label de Especialidades
        const especialidadades = await this.getEspecialidades();
        const listEspecialidades: string[] = [];
     
        if (especialidadades) {
            especialidadades.forEach((especialidad) => {
                listEspecialidades.push(especialidad.nombre);
            });
        };

        //Falta asignar generar el array data : relacionado con el label especialidad, es decir el procentaje de turnos de cada especialdiad

        const totalTurnos : number = turnos.length;
    
        const data : number[] = listEspecialidades.map((especialidad)=>{
                let cantidad : number = 0;
               turnos.forEach((turno)=>{
                  
                   if(turno.especialidad?.nombre===especialidad){
                      cantidad++;
                   }
               });
               
               return cantidad*100/totalTurnos;
        });

    

        const barData3 = {
            labels: listEspecialidades,
            datasets: [{
                label: '% de Turnos Concretados por Especialidad',
                data,
                backgroundColor: [
                    'rgba(83, 162, 49, 0.7)',
                    'rgba(252, 242, 26, 0.7)',
                    'rgba(252, 149, 26, 0.7)',
                    'rgba(234, 38, 26, 0.7)'
                ],
                fill: false,
                borderColor: [
                    'rgba(255, 255, 255)',
                    'rgba(255, 159, 64)',
                    'rgba(255, 205, 86)',
                    'rgba(255, 192, 192)'
                ],
                tension: 0.1
            }]
        };

            // Destruir el grafico existente
            if (this.barChart3) {
                this.barChart3.destroy();
            }
    
            this.barChart3 = new Chart("barChart3", {
                type: 'bar' as ChartType,
                data: barData3
            });




    }



    async getEspecialidades(): Promise<Especialidad[] | undefined> {
        try {
            const especialidades: Especialidad[] = await firstValueFrom(this._especialidadService.getAll());
            return especialidades;
        } catch (error) {
            console.error(error);
            this.toastr.error('Error al generar informes', 'Error');
            return undefined;
        }
    }

    async getTurnosG3() {
        //Filtro solo los turnos concretados

        const turnos = this.listTurnos.filter((turno) => turno.estado === 'Concretado');


        //Asigno a cada turno la especialidad correspondiente.

        try {
            await Promise.all(turnos.map(async (turno) => {
                const especialidad: Especialidad = await firstValueFrom(this._especialidadService.getEspecialidadByProfesional(turno.id_profesional));

                if (especialidad) {
                    turno.especialidad = especialidad;
                };
            }));
        } catch (error) {
            console.error(error);
            this.toastr.error('Error al generar informes', 'Error');

        }

        return turnos;



    }


       //Al entrar a la pagina los graficos que se crean a partir de la seleccion de fechas se generan para el mes actual
    async cargaInicialGraficos(){
         this.mesActual();

         await this.getListTurnos();
        this.initGrafico2();
        await this.initGrafico3();

        
    }

     //Asigna las fechas del primer y ultimo dia del mes para traer los turnos
    mesActual(){
        const fechaActual = new Date();

        const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

        this.fechaDesdeDB = this.sharedFunctions.formatoFechaDB(primerDiaMes);
        this.fechaHastaDB = this.sharedFunctions.formatoFechaDB(ultimoDiaMes);

        this.fechaDesdeInput = this.sharedFunctions.formatoFechaString(primerDiaMes);
        this.fechaHastaInput = this.sharedFunctions.formatoFechaString(ultimoDiaMes);


    }






}
