import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { config, firstValueFrom } from 'rxjs';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { Turno } from 'src/app/interfaces/Turno';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SharedFunctions } from 'src/app/utils/SharedFunctions';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  listTurno: Turno[] = [];
  errorServer : string | null = null;
  loading : boolean = false; 

  fechaDesdeDate = new Date();
  fechaHastaDate = new Date();
  
  fechaDesde : string | null = null;
  fechaHasta : string | null = null;
   
  fechaDesdeFormateada : string | null = null;
  fechaHastaFormateada : string | null = null;

  modal = false;
  idTurnoModal : number = 0;

  searchText : string = '';

  constructor(private sharedFunctions : SharedFunctions,
              private _turnoService : TurnoService,
              private toastr : ToastrService,
              private _userService : UsuarioService,
              private _especialidadService : EspecialidadService,
              private router : Router) {

  }

  async ngOnInit() : Promise<void> {
      await this.getTurnosByFecha();
  }

  async getTurnosByFecha() {
    this.fechaDesdeFormateada = this.sharedFunctions.formatoFechaString(this.fechaDesdeDate);
    this.fechaHastaFormateada = this.sharedFunctions.formatoFechaString(this.fechaHastaDate);
  

    const fechas = {
       fechaDesde: this.sharedFunctions.formatoFechaDB(this.fechaDesdeDate),
       fechaHasta: this.sharedFunctions.formatoFechaDB(this.fechaHastaDate)
    };

    try {
       const turnos = await firstValueFrom(this._turnoService.getTurnosByFecha(fechas));
       turnos.forEach((turno)=>{
          if(typeof turno.fecha === 'string'){
             const fecha = this.sharedFunctions.formatFechaLocal(turno.fecha!);
             turno.fechaLocal = fecha;
          }
       });
       this.listTurno = turnos;
      if(this.listTurno.length > 0){
       await this.getPaciente();
       await this.getProfesionales();
       await this.getEspecialidades();

     
      } else {
         this.toastr.error('No existen turnos en el periodo seleccionado');
      }
      

    } catch (error: any) {
       this.errorServer = error.error?.error || 'Error al obtener turnos';
       this.toastr.error('Error al otener datos.', 'Error');
    }
 }

 async getPaciente() {
    this.loading = true;
  try {
     for (let turno of this.listTurno) {
        const paciente = await firstValueFrom(this._turnoService.getPaciente(turno.id!));
     
        turno.paciente = paciente;
     }
     this.loading=false;
  } catch (error: any) {
   this.loading = false;
     this.errorServer = error.error?.error || 'Server error';
     this.toastr.error('Error Server', 'Error');
  }


}

async getProfesionales() {
   this.loading = true;
   try {
       for (let i = 0; i < this.listTurno.length; i++) {
           const turno = this.listTurno[i];
           const profesional = await firstValueFrom(this._userService.getOne(turno.id_profesional));
           turno.profesional = profesional!;
       }
       this.loading = false;
   } catch (error) {
      this.loading=false;
       console.error(error);
       this.toastr.error('Error al obtener profesionales de los turnos', 'Error');
   }
}

async getEspecialidades() {
   this.loading = true;
   try {
       for (let i = 0; i < this.listTurno.length; i++) {
           const turno = this.listTurno[i];
           console.log('id especialidad: ', turno.profesional);
           const especialidad: Especialidad = await firstValueFrom(this._especialidadService.getOne(turno.profesional?.id_especialidad!));
           turno.especialidad = especialidad!;
       }
       this.loading = false;
   } catch (error) {
      this.loading = false;
       console.error(error);
       this.toastr.error('Error al obtener especialidades de los turnos', 'Error');
   }
}



  seleccionarFechaDesde(event: { year: number; month: number; day: number }) {

    // Crear un objeto NgbDate con las propiedades requeridas
    const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

    this.fechaDesdeDate = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day);

    this.fechaDesde = this.sharedFunctions.formatoFechaDB(this.fechaDesdeDate);

    this.fechaDesdeFormateada = this.sharedFunctions.formatoFechaString(this.fechaDesdeDate);

  

 }

 seleccionarFechaHasta(event: { year: number; month: number; day: number }) {

  // Crear un objeto NgbDate con las propiedades requeridas
  const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

  this.fechaHastaDate = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day);

  this.fechaHasta = this.sharedFunctions.formatoFechaDB(this.fechaHastaDate);

  this.fechaHastaFormateada = this.sharedFunctions.formatoFechaString(this.fechaHastaDate);


}





async getAllTurnos() {
   this.loading = true;
   this.fechaDesdeFormateada = null;
   this.fechaHastaFormateada = null;
   this.fechaDesde = null;
   this.fechaHasta = null;
   try {
      const data: Turno[] = await firstValueFrom(this._turnoService.getAll());

      data.forEach((turno)=>{
         if(typeof turno.fecha === 'string'){
            const fecha = this.sharedFunctions.formatFechaLocal(turno.fecha!);
            turno.fechaLocal = fecha;
         }
         
      })
      this.listTurno = data;

      await this.getPaciente();
      await this.getProfesionales();
      await this.getEspecialidades();
      this.loading = false;

   } catch (error: any) {
      this.loading = false;
      this.errorServer = error.error?.error || 'Server error';
      this.toastr.error('Error al obtener Turnos', 'Error');
   }

}

getTurnosToday(){
   this.fechaDesdeDate = new Date();
   this.fechaHastaDate = new Date();

   this.getTurnosByFecha();
}

getTurnosTomorrow(){
   const fechaActual = new Date();

   this.fechaDesdeDate.setDate(fechaActual.getDate()+1);
   this.fechaHastaDate.setDate(fechaActual.getDate()+1);

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

 async deleteTurno(id : number){
   this.loading = true;
   if(confirm('Desea eliminar el registro?')){
    try{
       
         await firstValueFrom(this._turnoService.delete(id));
         
         this.toastr.success('Turno eliminado exitosamente');
         this.getTurnosByFecha();
         this.loading = false;
    }catch(error){
      this.loading = false;
      console.error(error);
      this.toastr.error('Error al eliminar registro', 'Error');
    }

        }
 
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
