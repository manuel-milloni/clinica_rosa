import { Component,OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Turno } from 'src/app/interfaces/Turno';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SharedFunctions } from 'src/app/utils/SharedFunctions';

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
      private sharedFunctions : SharedFunctions
   ) {

   }
   async ngOnInit(): Promise<void> {
      await this.getId();
      await this.getTurnosToday();
   

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


   async getAllTurnos() {
      this.fechaDesdeFormateada = null;
      this.fechaHastaFormateada = null;
      this.fechaDesde = null;
      this.fechaHasta = null;
      try {
         const data: Turno[] = await firstValueFrom(this._userService.getTurnosByProfesional(this.id!));

         data.forEach((turno)=>{
            if(typeof turno.fecha === 'string'){
               const fecha = this.sharedFunctions.formatFechaLocal(turno.fecha!);
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

      this.fechaDesde = this.sharedFunctions.formatoFechaDB(this.fechaDesdeDate);

      this.fechaDesdeFormateada = this.sharedFunctions.formatoFechaString(this.fechaDesdeDate);

      this.mostrarCalendarioFD = false;

   }

   seleccionarFechaHasta(event: { year: number; month: number; day: number }) {

      // Crear un objeto NgbDate con las propiedades requeridas
      const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

      this.fechaHastaDate = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day);

      this.fechaHasta = this.sharedFunctions.formatoFechaDB(this.fechaHastaDate);

      this.fechaHastaFormateada = this.sharedFunctions.formatoFechaString(this.fechaHastaDate);

      this.mostrarCalendarioFH = false;
   }

   toggleCalendarioFechaDesde() {
      this.mostrarCalendarioFD = !this.mostrarCalendarioFD;
   }

   toggleCalendarioFechaHasta() {
      this.mostrarCalendarioFH = !this.mostrarCalendarioFH;
   }

   // Función auxiliar para agregar ceros a la izquierda si es necesario
   agregarCerosIzquierda(numero: number, longitud: number): string {
      return String(numero).padStart(longitud, '0');
   }

   async getTurnosByFecha() {
    

      const fechas = {
         fechaDesde: this.sharedFunctions.formatoFechaDB(this.fechaDesdeDate),
         fechaHasta: this.sharedFunctions.formatoFechaDB(this.fechaHastaDate)
      };

      try {
         const turnos = await firstValueFrom(this._turnoService.getTurnosByFechaAndProfesional(fechas, this.id!));
         turnos.forEach((turno)=>{
            if(typeof turno.fecha === 'string'){
               const fecha = this.sharedFunctions.formatFechaLocal(turno.fecha!);
               turno.fechaLocal = fecha;
            }
         });
         this.listTurno = turnos;
        if(this.listTurno.length > 0){
         await this.getPaciente();
        } else {
           this.toastr.error('No existen turnos en el periodo seleccionado');
        }
        

      } catch (error: any) {
         this.errorServe = error.error?.error || 'Error al obtener turnos';
         this.toastr.error('Error al otener datos.', 'Error');
      }
   }

  async  getTurnosToday(){

       this.fechaDesdeDate = new Date();
       this.fechaHastaDate = new Date();
       this.fechaDesdeFormateada = this.sharedFunctions.formatoFechaString(this.fechaDesdeDate);
       this.fechaHastaFormateada = this.sharedFunctions.formatoFechaString(this.fechaHastaDate);
       this.getTurnosByFecha();
       
   }

   async getTurnosTomorrow(){
        const fechaActual = new Date();
        const fechaTomorrow = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate()+1);
        this.fechaDesdeDate = fechaTomorrow;
        this.fechaHastaDate = fechaTomorrow;
        this.fechaDesdeFormateada = this.sharedFunctions.formatoFechaString(this.fechaDesdeDate);
        this.fechaHastaFormateada = this.sharedFunctions.formatoFechaString(this.fechaHastaDate);
        this.getTurnosByFecha(); 
   }

   abrirModal(idTurno : number) {
      this.idTurnoModal = idTurno;
      this.modal = true;
    }

    cerrarModal() {
      this.modal = false;
      if(this.fechaDesde === null && this.fechaHasta === null){
         this.getAllTurnos();
      } else {
         this.getTurnosByFecha();
      }
    }
    


}
