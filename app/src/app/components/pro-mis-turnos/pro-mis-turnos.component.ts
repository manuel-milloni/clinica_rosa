import { Component, OnInit } from '@angular/core';
import { Router, UrlHandlingStrategy } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Turno } from 'src/app/interfaces/Turno';
import { Usuario } from 'src/app/interfaces/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pro-mis-turnos',
  templateUrl: './pro-mis-turnos.component.html',
  styleUrls: ['./pro-mis-turnos.component.css']
})
export class ProMisTurnosComponent implements OnInit {
             id : number | undefined;
             listTurno : Turno[] = [];
             errorServe : string | null = null;
             fechaDesde: string | null = null;
             fechaHasta: string | null = null;
             mostrarCalendarioFD: boolean = false;
             mostrarCalendarioFH: boolean = false;
             fechaDesdeFormateada : string | null = null;
             fechaHastaFormateada : string | null = null;
             
    
     constructor(private _authService : AuthService,
                 private toastr : ToastrService,
                 private router : Router,
                 private _userService : UsuarioService,
                 private _turnoService : TurnoService,
                  ){

     }
  async ngOnInit(): Promise<void> {
     await this.getId();
     await this.getTurnosToday();
     await this.getPaciente();
      
    }

    async getId(){
       const token = localStorage.getItem('auth-token');

       if(!token){
          this.router.navigate(['login']);
          this.toastr.error('Inicie sesion para continuar', 'Acceso denegado');
          return;
       }

       try{

        const data : any = await firstValueFrom(this._authService.verifyToken(token));
        this.id = data.id;

       }catch(error : any){
         this.toastr.error(error.toString(), 'Error');
       }
       

    }



     //Ver de hacer que solo traiga los turnos del dia actual, y otra funcion que filtre por fecha
    async getTurnosToday(){
          try{
             const data : Turno[] = await firstValueFrom(this._userService.getTurnosByProfesional(this.id!));
             this.listTurno = data;

          }catch(error : any){
             this.errorServe = error.error?.error || 'Server error';
             this.toastr.error(error, 'Error');
          }

    }

    async getPaciente(){

      try{
         for(let turno of this.listTurno){
            const paciente = await firstValueFrom(this._turnoService.getPaciente(turno.id!));
            console.log('Paciente: ', paciente);
            turno.paciente = paciente;
      }
      }catch(error : any){
         this.errorServe = error.error?.error || 'Server error';
         this.toastr.error(error, 'Error');
      }
         

    }

    seleccionarFechaDesde(event: { year: number; month: number; day: number }){
   
      // Crear un objeto NgbDate con las propiedades requeridas
      const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);
      console.log('Fecha Desde: ', this.fechaDesde);
       // Obtener los componentes de la fecha
    const year = fechaSeleccionada.year;
    const month = fechaSeleccionada.month;
    const day = fechaSeleccionada.day;

   // Formatear la fecha como 'yyyy-mm-dd'
      // Formatear la fecha como 'yyyy-mm-dd'
      const fechaFormateada: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      console.log('Fecha Formateada: ', fechaFormateada);

      this.fechaDesdeFormateada = this.formatearFechaLocal(fechaFormateada);
     
    }

    seleccionarFechaHasta(event: { year: number; month: number; day: number }){
   
      // Crear un objeto NgbDate con las propiedades requeridas
      const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);
      console.log('Fecha Hasta: ', this.fechaHasta);
       // Obtener los componentes de la fecha
    const year = fechaSeleccionada.year;
    const month = fechaSeleccionada.month;
    const day = fechaSeleccionada.day;

   // Formatear la fecha como 'yyyy-mm-dd'
      // Formatear la fecha como 'yyyy-mm-dd'
      const fechaFormateada: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      console.log('Fecha Formateada: ', fechaFormateada);

      this.fechaHastaFormateada = this.formatearFechaLocal(fechaFormateada);
    }

    toggleCalendarioFechaDesde() {
      this.mostrarCalendarioFD = !this.mostrarCalendarioFD;
    }

    toggleCalendarioFechaHasta() {
      this.mostrarCalendarioFH = !this.mostrarCalendarioFH;
    }

    formatearFechaLocal(fecha : string) : string {
             // Dividir la cadena de fecha en sus componentes (año, mes, día)
            const partesFecha: string[] = fecha.split('-');

         // Invertir el orden de los componentes y unirlos nuevamente en una cadena
         const fechaFormateada: string = partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0];

               return fechaFormateada;
    }

    getTurnosByFecha(){
      
    }

      
   




}
