import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Turno } from 'src/app/interfaces/Turno';
import { Usuario } from 'src/app/interfaces/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';


import { Chart, ChartType } from 'chart.js/auto';
import { SharedFunctions } from 'src/app/utils/SharedFunctions';
import { Modal } from 'bootstrap';

@Component({
    selector: 'app-pro-informes',
    templateUrl: './pro-informes.component.html',
    styleUrls: ['./pro-informes.component.css']
})
export class ProInformesComponent implements OnInit {
    mostrarCalendarioFD: boolean = false;
    mostrarCalendarioFH: boolean = false;

    fechaDesde: NgbDate | undefined;
    fechaHasta: NgbDate | undefined;

    fechaDesdeInput: string | undefined;
    fechaHastaInput: string | undefined;

    fechaDesdeDB: string | undefined;
    fechaHastaDB: string | undefined;

    profesional: Usuario | undefined;

    listTurnosLast12M: Turno[] = [];
    listTurnos: Turno[] = [];

    public lineChart: Chart | undefined;
    public barChart: Chart | undefined;
    public barChart3: Chart | undefined;
    public barChart4: Chart | undefined;



    constructor(private _usuarioService: UsuarioService,
        private _turnoService: TurnoService,
        private toastr: ToastrService,
        private _authService: AuthService,
        private router: Router,
        private sharedFunctions: SharedFunctions) {

    }

    async ngOnInit(): Promise<void> {
        await this.getProfesional();
        this.getLast12M();
        await this.getTurnosLast12M();
        this.generarArrayCantidadTurnosPorMes(this.listTurnosLast12M);
        this.initLineChart();
        this.cargainicial();

    }

    async getProfesional() {
        const token = localStorage.getItem('auth-token');

        if (!token) {
            this.toastr.error('Error al validar Usuario', 'Error');
            this.router.navigate(['/login']);
            return;

        }

        try {

            const payload: any = await firstValueFrom(this._authService.verifyToken(token));

            const profesional: Usuario = await firstValueFrom(this._usuarioService.getOne(payload.id));

            this.profesional = profesional;

        } catch (error: any) {
            this.toastr.error('Error al validar Profesional', 'Error');
            console.error(error);
        }

    }



    getLast12M() {
        //Label de meses para el grafico de los ultimos 12 meses.
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
            const turnos: Turno[] = await firstValueFrom(this._turnoService.getTurnosByFechaAndProfesional(body, this.profesional?.id!));

            this.listTurnosLast12M = turnos;

            console.log('Turnos dle pro: ', turnos);


        } catch (error) {
            console.error(error);
            this.toastr.error('Error al obtener informe de turnos', 'Error');
        }


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

    //------------------------------------------ 
    toogleFD() {
        this.mostrarCalendarioFD = !this.mostrarCalendarioFD;
    }

    toogleFH() {
        this.mostrarCalendarioFH = !this.mostrarCalendarioFH;
    }

    seleccionarFechaDesde(event: { year: number; month: number; day: number }) {
        const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

        this.fechaDesde = fechaSeleccionada;

        console.log('Fecha seleccionada: ', fechaSeleccionada);

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
            await this.getListTurnosProfesional();
        this.initGrafico2();
        await this.initGrafico3();
        await this.initGrafico4();
        } else {
            this.toastr.error('La fecha desde debe ser menor a la fecha hasta', 'Error');
        }

    }

    //Valido fechas ingresadas para busqueda
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

    //Obtiene array de turnos del Profesinoal en el periodo indicado.
    async getListTurnosProfesional() {
        const body: any = {
            fechaDesde: this.fechaDesdeDB,
            fechaHasta: this.fechaHastaDB
        };

        try {
            const turnos: Turno[] = await firstValueFrom(this._turnoService.getTurnosByFechaAndProfesional(body, this.profesional?.id!));

            this.listTurnos = turnos;

            console.log('Turnos: ', this.listTurnos);
        } catch (error) {
            console.error(error);
            this.toastr.error('Error al obtener informe de turnos', 'Error');
        }
    }

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

    //------------------Grafico Genero (Concretados)-------------------------------------------------

    async initGrafico3() {
        const labelGeneros: string[] = ['F', 'M'];

        try {
            const turnos: Turno[] = await this.getTurnosG3(); // Espera a que se resuelva la promesa

            const data: number[] = labelGeneros.map((genero) => {
                const cantidadTurnos = turnos.filter((turno) => turno.paciente?.genero === genero).length;

                return cantidadTurnos * 100 / turnos.length;
            });

            const barData = {
                labels: labelGeneros,
                datasets: [{
                    label: '% Turnos por Genero(Concretados)',
                    data,
                    backgroundColor: [
                        'rgba(83, 162, 49, 0.7)',
                        'rgba(252, 242, 26, 0.7)'
                    ],
                    fill: false,
                    borderColor: [
                        'rgba(255, 255, 255)',
                        'rgba(255, 159, 64)'
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
                data: barData
            });
        } catch (error) {
            console.error(error);
            this.toastr.error('Error al generar informes', 'Error');
        }
    }


    //Asigno a cada turno su Paciente.
    async getTurnosG3(): Promise<Turno[]> {
        //Filtro solo los turnos concretados
        const turnos = this.listTurnos.filter((turno) => turno.estado === 'Concretado');
        //Asigno a cada turno la especialidad correspondiente.
        try {
            await Promise.all(turnos.map(async (turno) => {
                const paciente: Usuario = await firstValueFrom(this._usuarioService.getOne(turno.id_paciente));

                if (paciente) {
                    turno.paciente = paciente;
                };
            }));
        } catch (error) {
            console.error(error);
            this.toastr.error('Error al generar informes', 'Error');

        }

        return turnos;

    }

    //---------------------- Grafico rango edades(Concretados) ---------------------------------------

    async initGrafico4() {
        const labelEdades: string[] = ['0-18', '19-50', '51 o +'];

        try {
            const turnos: Turno[] = await this.getTurnosG3(); 

            //Genero Array de Edades
            const edades: number[] = turnos.map(turno => {
                const paciente = turno.paciente;
                if (paciente && paciente.fecha_nac) {
                    return this.getEdad(paciente.fecha_nac);
                }
                return 0;
            });
              //Ubico edades en los rangos correspondientes
            const datos: number[] = labelEdades.map(rango => {
                const [inicio, fin] = rango.split('-').map(Number);
                if (fin === undefined) {
                    return edades.filter(edad => edad >= inicio).length;
                } else {
                    return edades.filter(edad => edad >= inicio && edad <= fin).length;
                }
            });
               //Defino porcentajes
            const data : number[] = datos.map((cant)=>{
                      return cant * 100 / turnos.length;
            })



            const barData = {
                labels: labelEdades,
                datasets: [{
                    label: '% Turnos por Edad(Concretados)',
                    data,
                    backgroundColor: [
                        'rgba(83, 162, 49, 0.7)',
                        'rgba(252, 242, 26, 0.7)'
                    ],
                    fill: false,
                    borderColor: [
                        'rgba(255, 255, 255)',
                        'rgba(255, 159, 64)'
                    ],
                    tension: 0.1
                }]
            };

            // Destruir el grafico existente
            if (this.barChart4) {
                this.barChart4.destroy();
            }

            this.barChart4 = new Chart("barChart4", {
                type: 'bar' as ChartType,
                data: barData
            });
        } catch (error) {
            console.error(error);
            this.toastr.error('Error al generar informes', 'Error');
        }
    }

    getEdad(fechaNac: string): number {
        const fechaNacimiento: Date = new Date(fechaNac);
        const fechaActual: Date = new Date();

        const diferenciaMs: number = fechaActual.getTime() - fechaNacimiento.getTime();

        const edadEnMs: number = diferenciaMs / (1000 * 60 * 60 * 24 * 365);

        const edad: number = Math.floor(edadEnMs);
        console.log(edad);
        return edad;


    }

    async cargainicial() {
         this.mesActual();
         await this.getListTurnosProfesional();
         this.initGrafico2();
         await this.initGrafico3();
         await this.initGrafico4();
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

        this.fechaDesde = new NgbDate(primerDiaMes.getFullYear(), primerDiaMes.getMonth()+1, primerDiaMes.getDate());
        this.fechaHasta = new NgbDate(ultimoDiaMes.getFullYear(), ultimoDiaMes.getMonth()+1, ultimoDiaMes.getDate());

      


    }

    abrirModalFD() {
        const modalElement: any = document.getElementById('modalFechaDesde');
        if (modalElement) {
           const modal = new Modal(modalElement);
           modal.show();
        }
      }

      abrirModalFH() {
        const modalElement: any = document.getElementById('modalFechaHasta');
        if (modalElement) {
           const modal = new Modal(modalElement);
           modal.show();
        }
      }






}
