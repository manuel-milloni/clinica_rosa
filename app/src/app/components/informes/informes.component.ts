import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Turno } from 'src/app/interfaces/Turno';
import { TurnoService } from 'src/app/services/turno.service';

import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
        mostrarCalendarioFD : boolean = false;
        mostrarCalendarioFH : boolean = false;

        fechaDesde : NgbDate | undefined;
        fechaHasta : NgbDate | undefined;

        fechaDesdeInput : string | undefined;
        fechaHastaInput : string | undefined;

        fechaDesdeDB : string | undefined;
        fechaHastaDB : string | undefined;

        listTurnos : Turno[] = []; 
        listTurnosLast12M : Turno[] = []; 

        public lineChart : Chart | undefined;


     
      constructor(private _turnoService : TurnoService,
                  private toastr : ToastrService){

      }

      async ngOnInit(): Promise<void> {
          this.getLast12M();
          await this.getTurnosLast12M();
          this.generarArrayCantidadTurnosPorMes(this.listTurnosLast12M);
          this.initLineChart();
      }

      toogleFD(){
         this.mostrarCalendarioFD = !this.mostrarCalendarioFD;
      }

      toogleFH(){
        this.mostrarCalendarioFH = !this.mostrarCalendarioFH;
     }

      seleccionarFechaDesde (event : {year: number; month: number; day: number}){
          const fechaSeleccionada : NgbDate = new NgbDate(event.year, event.month, event.day);
          
          this.fechaDesde = fechaSeleccionada;

          console.log('Fecha seleccionada: ', fechaSeleccionada);

          this.fechaDesdeInput = this.formatearFechaLocal(fechaSeleccionada);

          this.fechaDesdeDB = this.formatearFecha(fechaSeleccionada);

          this.mostrarCalendarioFD = false;

      }

      seleccionarFechaHasta (event : {year: number; month: number; day: number}){
        const fechaSeleccionada : NgbDate = new NgbDate(event.year, event.month, event.day);
        
        this.fechaHasta = fechaSeleccionada;

       

        this.fechaHastaInput = this.formatearFechaLocal(fechaSeleccionada);

        this.fechaHastaDB = this.formatearFecha(fechaSeleccionada);

        this.mostrarCalendarioFH = false;

    }

      formatearFechaLocal(fecha : NgbDate) : string{
          const fechaFormateada : string = `${fecha.day.toString().padStart(2,'0')}/${fecha.month.toString().padStart(2,'0')}/${fecha.year}`;
          
          return fechaFormateada; 
      }

      formatearFecha(fecha : NgbDate) : string{
          const fechaFormateada : string = `${fecha.year}-${fecha.month.toString().padStart(2, '0')}-${fecha.day.toString().padStart(2, '0')}`;

          return fechaFormateada;
      }

      buscar(){
          console.log(this.fechaDesdeInput, '   ', this.fechaHastaInput);
          this.generarArrayMeses();

      }

    

      async getTurnos(){
          const body : any = {
               fechaDesde : this.fechaDesdeDB,
               fechaHasta : this.fechaHastaDB
          };

          try{
             const turnos : Turno[] = await firstValueFrom( this._turnoService.getTurnosByFecha(body));

             this.listTurnos = turnos;

             console.log('Turnos: ', this.listTurnos);
          }catch(error){
             console.error(error);
             this.toastr.error('Error al obtener informe de turnos', 'Error');
          }
      }



      generarArrayMeses(){
        const labelMeses : string[] = [];
    
        if (this.fechaDesde && this.fechaHasta) {
            const fechaDesde = new Date(this.fechaDesde.year, this.fechaDesde.month - 1, this.fechaDesde.day);
            const fechaHasta = new Date(this.fechaHasta.year, this.fechaHasta.month - 1, this.fechaHasta.day);
    
            let currentDate = new Date(fechaDesde);
            while (currentDate <= fechaHasta) {
                const monthName = currentDate.toLocaleString('default', { month: 'long' });
                labelMeses.push(this.capitalizeFirstLetter(monthName));
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }
    
        console.log(labelMeses);
    }


    //------------------------- LINE CHART-----------------------------------------------------------------------------------

    getLast12M(){

        const monthsArray: string[] = [];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
      
        for (let i = 0; i < 12; i++) {
          const monthDate = new Date(currentDate.getFullYear(), currentMonth - i);
          const monthName = monthDate.toLocaleString('default', { month: 'long' });
          monthsArray.push(monthName);
        }
      
        console.log('Meses: ', monthsArray.reverse());
        return monthsArray; 
    }

    //Modificar para que traiga solo los de Estado 'Asistido'
   async getTurnosLast12M(){

         //Genero fecha Desde
         const currentDate : Date = new Date();
         const currentMonth = currentDate.getMonth();
         const currentYear = currentDate.getFullYear();

         const elevenMonthsAgo = (currentMonth -11 + 12) % 12;
         const elevenMonthsAgoYear = currentYear - (currentMonth < 11 ? 1 : 0); //Si estamos en Diciembre los 11 meses anteriores al actual van a estar dentro del mismo anio pero de lo contrario la fecha inicial tambien cambia de anio
         
         const fechaDesdeDate : NgbDate = new NgbDate(elevenMonthsAgoYear, elevenMonthsAgo+1, 1); //Se suma uno al mes porque los meses en JS van de 0 a 11 y en NgbDate(Angular) van de 1 al 12
       
         const fechaActual : NgbDate = new NgbDate(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
         const fechaDesde = this.formatearFecha(fechaDesdeDate);
       
         const fechaHasta  = this.formatearFecha(fechaActual);
         
         
         const body : any =  {
             fechaDesde : fechaDesde,
             fechaHasta : fechaHasta
         };

        try{
           const turnos : Turno[] = await firstValueFrom( this._turnoService.getTurnosByFecha(body));

           this.listTurnosLast12M = turnos;

           console.log('Turnos: ', this.listTurnos);
        }catch(error){
           console.error(error);
           this.toastr.error('Error al obtener informe de turnos', 'Error');
        }

        console.log(this.listTurnosLast12M);
    }

    initLineChart(){
        //Grafico Linea Cant turnos mensual de los ult 12 meses.
        
        const labelMonths : string[] = this.getLast12M();
        const data : number[] = this.generarArrayCantidadTurnosPorMes(this.listTurnosLast12M);
        const lineData = {
            labels : labelMonths,
            datasets : [{
                label : 'Turnos Mensuales de los ult 12 meses.',
                data ,
                fill : false,
                borderColor : 'rgb(75, 192, 192)',
                tension : 0.1
            }]
        };

        this.lineChart = new Chart("lineChart", {
            type: 'line' as ChartType,
            data : lineData
        });

    }

    capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    generarData(){
         const months : string[] = this.getLast12M();
         
         this.listTurnosLast12M.forEach((turno)=>{
            if(typeof turno.fecha === 'string'){
                const partesFecha = turno.fecha.split('-');
             const fechaTurno = new Date(parseInt(partesFecha[0]), parseInt(partesFecha[1])-1, parseInt(partesFecha[2]));

            }
             
         })

    }

    generarArrayCantidadTurnosPorMes(listTurnosLast12M: Turno[]) {
        const cantidadPorMes: { [mes: string]: number } = {};
    
        // Inicializar el objeto con 0 turnos para cada mes
        this.getLast12M().forEach(month => {
            cantidadPorMes[month] = 0;
        });
    
        // Iterar sobre los turnos
        listTurnosLast12M.forEach(turno => {
            // Convertir la fecha a un objeto Date si es un string
            const fechaTurno = typeof turno.fecha === 'string' ? new Date(turno.fecha) : turno.fecha;
    
            // Obtener el mes (nombre)
            const mes = fechaTurno.toLocaleString('default', { month: 'long' });
    
            // Incrementar la cantidad de turnos para el mes correspondiente
            cantidadPorMes[mes]++;
        });
    
        // Crear el array de cantidades de turnos en el mismo orden que el de meses
        const arrayCantidadPorMes = this.getLast12M().map(month => cantidadPorMes[month]);
    
        console.log(arrayCantidadPorMes);
        return arrayCantidadPorMes;
    }
    


      //Grafico lineas que muestre cantidad de turnos 'asistidos' por mes(ultimos 12 meses)
      //necesitaria que dentro de la fecha que el usuario selecciona:
            //Traiga todos los turnos en el periodo seleccionado
            // -Genere el labels de meses
            // -Genere array de cantidad de turnos para cada mes




      

}
