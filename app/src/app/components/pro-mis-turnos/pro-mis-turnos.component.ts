import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, UrlHandlingStrategy } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Turno } from 'src/app/interfaces/Turno';
import { Usuario } from 'src/app/interfaces/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EditModalComponent } from './edit-modal/edit-modal.component';

@Component({
   selector: 'app-pro-mis-turnos',
   templateUrl: './pro-mis-turnos.component.html',
   styleUrls: ['./pro-mis-turnos.component.css']
})
export class ProMisTurnosComponent implements OnInit {
   id: number | undefined;
   listTurno: Turno[] = [];
   errorServe: string | null = null;
   fechaDesde: string | null = null;
   fechaHasta: string | null = null;
   mostrarCalendarioFD: boolean = false;
   mostrarCalendarioFH: boolean = false;

   fechaDesdeFormateada: string | null = null;
   fechaHastaFormateada: string | null = null;

   fechaDesdeDate: Date = new Date();
   fechaHastaDate: Date = new Date();

   idTurnoModal : number = 0;

   modal = false;


   constructor(private _authService: AuthService,
      private toastr: ToastrService,
      private router: Router,
      private _userService: UsuarioService,
      private _turnoService: TurnoService,
   ) {

   }
   async ngOnInit(): Promise<void> {
      await this.getId();
      await this.getAllTurnos();
   

   }

   async getId() {
      const token = localStorage.getItem('auth-token');

      if (!token) {
         this.router.navigate(['login']);
         this.toastr.error('Inicie sesion para continuar', 'Acceso denegado');
         return;
      }

      try {

         const data: any = await firstValueFrom(this._authService.verifyToken(token));
         this.id = data.id;

      } catch (error: any) {
         console.error(error.toString());
         this.toastr.error('Inicie sesion para continuar', 'Acceso denegado');
      }


   }



   //Ver de hacer que solo traiga los turnos del dia actual, y otra funcion que filtre por fecha
   async getAllTurnos() {
      try {
         const data: Turno[] = await firstValueFrom(this._userService.getTurnosByProfesional(this.id!));

         data.forEach((turno)=>{
            if(typeof turno.fecha === 'string'){
               const fecha = this.formatFechaLocal(turno.fecha!);
               turno.fechaLocal = fecha;

            }
            
         })
         this.listTurno = data;

         await this.getPaciente();

      } catch (error: any) {
         this.errorServe = error.error?.error || 'Server error';
         this.toastr.error('Error al obtener Turnos', 'Error');
      }

   }


   async getPaciente() {

      try {
         for (let turno of this.listTurno) {
            const paciente = await firstValueFrom(this._turnoService.getPaciente(turno.id!));
         
            turno.paciente = paciente;
         }
      } catch (error: any) {
         this.errorServe = error.error?.error || 'Server error';
         this.toastr.error('Error Server', 'Error');
      }


   }

   seleccionarFechaDesde(event: { year: number; month: number; day: number }) {

      // Crear un objeto NgbDate con las propiedades requeridas
      const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

      this.fechaDesdeDate = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day);

      this.fechaDesde = this.formatNgbDate(this.fechaDesdeDate);

      this.fechaDesdeFormateada = this.formatearFechaLocal(this.fechaDesdeDate);

      this.mostrarCalendarioFD = false;


   }

   seleccionarFechaHasta(event: { year: number; month: number; day: number }) {

      // Crear un objeto NgbDate con las propiedades requeridas
      const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);


      this.fechaHastaDate = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day);

      this.fechaHasta = this.formatNgbDate(this.fechaHastaDate);

      this.fechaHastaFormateada = this.formatearFechaLocal(this.fechaHastaDate);

      this.mostrarCalendarioFH = false;
   }

   toggleCalendarioFechaDesde() {
      this.mostrarCalendarioFD = !this.mostrarCalendarioFD;
   }

   toggleCalendarioFechaHasta() {
      this.mostrarCalendarioFH = !this.mostrarCalendarioFH;
   }

   //Formato yyyy-mm-dd
   formatearFecha(fecha: NgbDate): string {
      const year = fecha.year;
      const month = fecha.month;
      const day = fecha.day;

      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

   }

   formatearFechaLocal(fecha: Date): string {
      // Obtener los componentes de la fecha
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por eso se suma 1
      const año = fecha.getFullYear();

      // Formatear los componentes de la fecha como cadenas y asegurarse de que tengan dos dígitos
      const diaFormateado = this.agregarCerosIzquierda(dia, 2);
      const mesFormateado = this.agregarCerosIzquierda(mes, 2);
      const añoFormateado = año.toString();

      // Construir la cadena de fecha en el formato deseado
      const fechaFormateada = `${diaFormateado}-${mesFormateado}-${añoFormateado}`;

      return fechaFormateada;


   }

   formatFechaLocal(fecha: string): string {
      const elementos = fecha.split('-');
      const fechaLocal: string = `${elementos[2]}/${elementos[1]}/${elementos[0]}`;

      return fechaLocal;
   }



   // Función auxiliar para agregar ceros a la izquierda si es necesario
   agregarCerosIzquierda(numero: number, longitud: number): string {
      return String(numero).padStart(longitud, '0');
   }

   async getTurnosByFecha() {
    

      const fechas = {
         fechaDesde: this.formatNgbDate(this.fechaDesdeDate),
         fechaHasta: this.formatNgbDate(this.fechaHastaDate)
      };

      try {
         const turnos = await firstValueFrom(this._turnoService.getTurnosByFechaAndProfesional(fechas, this.id!));
         this.listTurno = turnos;

         await this.getPaciente();

      } catch (error: any) {
         this.errorServe = error.error?.error || 'Error al obtener turnos';
         this.toastr.error('Error al otener datos.', 'Error');
      }
   }

   getTurnosToday(){
       this.fechaDesdeDate = new Date();
       this.fechaHastaDate = new Date();
       this.getTurnosByFecha();
   }

   formatNgbDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
   }

   abrirModal(idTurno : number) {
      this.idTurnoModal = idTurno;
      this.modal = true;
    }

    cerrarModal() {
      this.modal = false;
    }
    

    







}
