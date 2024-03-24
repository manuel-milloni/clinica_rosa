import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Horario } from 'src/app/interfaces/Horario';
import { Turno } from 'src/app/interfaces/Turno';
import { Usuario } from 'src/app/interfaces/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import { HorarioService } from 'src/app/services/horario.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';

//Reprogramar turno
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Time } from '@angular/common';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { Modal } from 'bootstrap';
import { SharedFunctions } from 'src/app/utils/SharedFunctions';

@Component({
   selector: 'app-mis-turnos-paciente',
   templateUrl: './mis-turnos-paciente.component.html',
   styleUrls: ['./mis-turnos-paciente.component.css']
})
export class MisTurnosPacienteComponent implements OnInit {
   listTurnos: Turno[] = [];
   errorServer: string | null = null;
   paciente: Usuario | undefined;
   idPaciente: number = 0;
   turno: Turno | undefined;
   profesional: Usuario | undefined;

   //Reprogramar turno
   horarioProfesional: Horario | undefined;
   mostrarHorarios: boolean = false;
   horariosDisponibles: string[] = [];
   fechaTurnoDate: Date = new Date();
   fechaTurnoString: string | null = null;
   fechaTurno: string | null = null;
   listTurnosRepro: Turno[] = [];
   horaString: string | null = null;
   horaTurno: Time | undefined;
   especialidad: Especialidad | undefined;
   modalMFechas: any;
   modalMConfirmacion: any;
   fechaMinima: NgbDateStruct = { year: 0, month: 0, day: 0 };

   constructor(private _turnoService: TurnoService,
      private toastr: ToastrService,
      private _userService: UsuarioService,
      private _authService: AuthService,
      private _horarioService: HorarioService,
      private _especialidadService: EspecialidadService,
      private router: Router,
      private sharedFunctions : SharedFunctions) {

   }

   async ngOnInit(): Promise<void> {
      await this.getPaciente();
      await this.getTurnos();
    
   }

   async getPaciente() {
      const token = localStorage.getItem('auth-token');
      if (!token) {

         this.toastr.error('Error al validar usuario', 'Error');
         this.router.navigate(['login']);
         return;

      }

      try {
         const payload: any = await firstValueFrom(this._authService.verifyToken(token!));

         this.idPaciente = payload.id;

         const paciente: Usuario = await firstValueFrom(this._userService.getOne(this.idPaciente));

         this.paciente = paciente;
      } catch (error: any) {
         this.errorServer = error.error?.error || 'Error al validar usuario';
         this.router.navigate(['login'])
         this.toastr.error(this.errorServer!, 'Error');

      }

   }

   async getTurnos() {

      try {
         const data: Turno[] = await firstValueFrom(this._turnoService.getTurnosPaciente(this.idPaciente));
         data.forEach((turno) => {
            if (typeof turno.fecha === 'string') {
               const fecha = this.formatFechaLocal(turno.fecha);
               turno.fechaLocal = fecha;
            }

         });

         this.listTurnos = data;

         await this.setProfesionalTurnos();
      } catch (error: any) {
         this.errorServer = error.error?.error || 'Error al obtener turnos del paciente';
         this.toastr.error(this.errorServer!, 'Error');
      }

   }

   formatFechaLocal(fecha: string): string {
      const elementos = fecha.split('-');
      const fechaLocal: string = `${elementos[2]}/${elementos[1]}/${elementos[0]}`;

      return fechaLocal;
   }


   async setProfesionalTurnos() {
      try {


         this.listTurnos.forEach(async (turno) => {
            const profesional: Usuario = await firstValueFrom(this._userService.getOne(turno.id_profesional));

            turno.profesional = profesional;
         })


      } catch (error: any) {
         this.errorServer = error.error?.error || 'Error server';
         this.toastr.error(this.errorServer!, 'Error');
      }


   }

   async cancelarTurno(idTurno: number) {
      if(confirm('Desea cancelar el turno seleccionado?')){
         const turno: Turno = this.listTurnos.find((turno) => idTurno === turno.id)!;

         const fechaTurnoDate = new Date(`${turno.fecha}T${turno.hora}`);
   
         if (this.valida48hs(fechaTurnoDate)) {
            try {
               await firstValueFrom(this._turnoService.delete(turno.id!));
               this.getTurnos();
               this.toastr.success('Turno cancelado exitosamente!');
            } catch (error: any) {
               this.errorServer = error.error?.error || 'Error al cancelar turno';
               this.toastr.error(this.errorServer!, 'Error');
            }
         } else {
            this.toastr.error('No es posible cancelar el turno, comuniquese con la Clinica', 'Error');
   
         }
      }




   }

   valida48hs(fechaTurno: Date): boolean {

      const fechaActual = new Date();

      const difMilisegundos = fechaTurno.getTime() - fechaActual.getTime();

      const difHoras = Math.abs(difMilisegundos / (1000 * 60 * 60));

      return difHoras > 48;

   }


   //Reprogramar turno ------------------------------------

   async reprogramarTurno(idTurno: number) {
      this.deshabilitarFechas();
      const turno: Turno = this.listTurnos.find((turno) => idTurno === turno.id)!;

      this.turno = turno;

      const fechaTurnoDate = new Date(`${turno.fecha}T${turno.hora}`);

      if (this.valida48hs(fechaTurnoDate)) {
         await this.getProfesional(turno.id_profesional);
         await this.getHorarioProfesional();

         this.modalFechas();


      } else {
         this.toastr.error('No es posible reprogramar el turno, comuniquese con la Clinica');
      }

   }

   async getProfesional(idProfesional: number) {
      try {
         const profesional: Usuario = await firstValueFrom(this._userService.getOne(idProfesional));
         this.profesional = profesional;
      } catch (error: any) {
         this.errorServer = error.error?.error || 'Error al obtener profesional del turno.';
         this.toastr.error(this.errorServer!, 'Error');
      }
   }

   //Obtengo el horario del profesional seleccionado
   async getHorarioProfesional() {

      try {
         const horarioProfesional: Horario = await firstValueFrom(this._horarioService.getOne(this.profesional?.id_horario!));
         this.horarioProfesional = horarioProfesional;
      } catch (error: any) {

         this.toastr.error('Error al obtener horario del profesional', error);
      }



   }


   //Genero modal de fechas
   async modalFechas() {
      const modalElement = document.getElementById('modalFechas');
      if (modalElement) {
         this.modalMFechas = new Modal(modalElement);
         this.modalMFechas.show();
         this.mostrarHorarios = false;
      }
   }

   //Deshabilito en el date picker las fechas anteiores al dia actual y el actual.
   deshabilitarFechas() {
      const currentDate = new Date();

      // Restar un día a la fecha actual para que también se deshabilite el día actual
      //currentDate.setDate(currentDate.getDate() - 1);

      // Asignar la fecha mínima al día anterior al actual
      this.fechaMinima = {
         year: currentDate.getFullYear(),
         month: currentDate.getMonth() + 1, // Nota: NgbDate usa meses basados en 1, no en 0
         day: currentDate.getDate() + 1
      };

     
   }



   // Funcion que se ejecuta cuando se clickea un día en el calendario
   async seleccionarDia(event: { year: number; month: number; day: number }): Promise<void> {

      this.horariosDisponibles = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
      this.mostrarHorarios = false;

      // Crear un objeto NgbDate con las propiedades requeridas
      const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

      this.fechaTurnoDate = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day);

      const year = fechaSeleccionada.year;
      const month = fechaSeleccionada.month;
      const day = fechaSeleccionada.day;

      // Formatear la fecha como 'yyyy-mm-dd'
      // Formatear la fecha como 'yyyy-mm-dd'
      const fechaFormateada: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
     

      // Asignar solo como cadena
      this.fechaTurnoString = this.sharedFunctions.formatoFechaString(this.fechaTurnoDate);
      this.fechaTurno = this.sharedFunctions.formatoFechaDB(this.fechaTurnoDate);

      // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
      const diaDeLaSemana: number = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day).getDay();

      // Convertir el número del día de la semana a una cadena de texto
      const diasSemana: string[] = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      const nombreDia: string = diasSemana[diaDeLaSemana];
      const diasHorarioProfesional = [];
     
      if (this.horarioProfesional?.lunes) {
         diasHorarioProfesional.push('lunes')
      };

      if (this.horarioProfesional?.martes) {
         diasHorarioProfesional.push('martes')
      };
      if (this.horarioProfesional?.miercoles) {
         diasHorarioProfesional.push('miercoles')
      };
      if (this.horarioProfesional?.jueves) {
         diasHorarioProfesional.push('jueves')
      };
      if (this.horarioProfesional?.viernes) {
         diasHorarioProfesional.push('viernes')
      };

      if (diasHorarioProfesional.some((dia) => dia === nombreDia)) {
         await this.getHorariosOcupados(fechaFormateada);
         this.generarArrayHorarios();
         this.modificarArrayHorarios();
         this.mostrarHorarios = true;
      }

   }
 

   //Devuelve los turnos del profesional seleccionado en el dia seleccionado
   async getHorariosOcupados(fecha: string): Promise<Turno[]> {
      // this.loading = true;
      // const idProfesional = Number(this.form_profesional.value.id_profesional)
      try {
         const data = await firstValueFrom(this._turnoService.getByProfesionalAndFecha(this.profesional?.id!, fecha));

         //    this.loading = false;
         this.listTurnosRepro = data!

         return data!;
      } catch (error) {
         //    this.loading = false;
         this.toastr.error('Error al obtener Turnos disponibles', 'Error');
         throw error;
      }


   }

   //Genera array de horarios con el rango de Horario del profesional
   generarArrayHorarios() {
      this.horariosDisponibles = [];
      const horaDesde: string = this.horarioProfesional?.horaDesde.toString()!;
      const horaHasta: string = this.horarioProfesional?.horaHasta.toString()!;
      const hrDesde = this.formatearHora(horaDesde);
      const hrHasta = this.formatearHora(horaHasta);

      // Verificar que hrDesde sea menor que hrHasta
      if (hrDesde < hrHasta) {
         // Generar horarios en intervalos de 30 minutos dentro del rango
         let horaActual = hrDesde;
         while (horaActual <= hrHasta) {
            this.horariosDisponibles.push(this.formatearHora(horaActual));
            horaActual = this.sumar30Minutos(horaActual);
         }
      } else {
         console.error("La hora de inicio debe ser menor que la hora de fin.");
      }
   }

   sumar30Minutos(hora: string): string {
      const [horas, minutos] = hora.split(':');
      let horaActual = new Date(0, 0, 0, Number(horas), Number(minutos));

      // Sumar 30 minutos
      horaActual.setMinutes(horaActual.getMinutes() + 30);

      // Obtener la nueva hora y formatearla
      const nuevaHora = this.formatearHora(`${horaActual.getHours()}:${horaActual.getMinutes()}`);
      return nuevaHora;
   }

   //Recorre los turnos del profesional en el dia seleccionado eliminando de los horarios que se mostraran para seleccionar aquellos que no esten disponibles
   async modificarArrayHorarios(): Promise<void> {

      try {
         this.listTurnosRepro.forEach((turno) => {
            const horaString: string = turno.hora.toString();
            if (this.horariosDisponibles.some((horaButton) => horaButton === this.formatearHora(horaString))) {
               const horaIndex = this.horariosDisponibles.indexOf(this.formatearHora(horaString));
               if (horaIndex !== -1) {
                  this.horariosDisponibles.splice(horaIndex, 1);
               }
            }

         })
      } finally {
         //    this.loading = false;
      }


   }

   //Convierte hora a string y formato 'hh:mm'
   formatearHora(time: string | undefined): string {
      if (time) {
         const [horas, minutos] = time.split(':');

         const horasFormateadas: string = horas.padStart(2, '0');
         const minutosFormateados: string = minutos.padStart(2, '0');

         const horaFormateada: string = `${horasFormateadas}:${minutosFormateados}`;

         return horaFormateada;
      } else {
        
         return 'Horario no disponible';
      }
   }



   async modalTurno(horario: string) {
    
    

      await this.getEspecialidad();

      this.horaString = horario;
      // convetir el string de hora a un objeto Time
      const [horas, minutos] = horario.split(':');
      this.horaTurno = { hours: parseInt(horas, 10), minutes: parseInt(minutos, 10) };
    
    
      const modalElement = document.getElementById('modalTurno');
      if (modalElement) {
         this.modalMConfirmacion = new Modal(modalElement);
         this.modalMConfirmacion.show();
      }
   }

   async getEspecialidad() {
      try {
         const especialidad: Especialidad = await firstValueFrom(this._especialidadService.getOne(this.profesional?.id_especialidad!));

         this.especialidad = especialidad;
      } catch (error) {
         this.toastr.error('Error al obtener especialidad del Profesional', 'Error');
      }
   }

   async createTurno() {
   
      const fecha = this.sharedFunctions.formatoFechaDB(this.fechaTurnoDate);
      const hora = this.formatTime(this.horaTurno!);

      if(await this.validaTurnoRepetido(fecha, hora)){
         const turno: Turno = {
            fecha: fecha,
            hora: hora,
            estado: 'Pendiente',
            observaciones: '',
            id_profesional: this.profesional!.id!,
            id_paciente: this.paciente?.id!
   
         };
   
         try {
            await firstValueFrom(this._turnoService.create(turno));
   
            const body: any = {
               estado: 'Cancelado'
            };
   
            await firstValueFrom(this._turnoService.update(body, this.turno!.id!));
   
            await this.getTurnos();
   
            this.cerrarModales();
   
          
   
            this.router.navigate(['mis-turnos']);
   
            // this.loading = false;
   
            this.toastr.success('Turno reprogramado exitosamente', 'Turno Generado');
   
         } catch (error: any) {
            // this.loading = false;
            this.errorServer = error.error?.error || 'Error al generar Turno',
               this.toastr.error(this.errorServer!, 'Error');
            console.error(error);
         }        
      } else {
         this.toastr.error('No es posible registrar mas de un turno en la misma fecha y hora', 'Error');
      }
     

   }

   async validaTurnoRepetido(fecha : string, hora : string ) : Promise<boolean>{
      console.log('Validando turno: ');
        const body = {
          fecha : fecha,
          hora : hora
        };
        try{
          const turno = await firstValueFrom(this._turnoService.getTurnoByPacFechaHora(body, this.paciente?.id!));
          console.log('Turno: ', turno);
          if(turno.length > 0){
           
             return false;
          } else {return true;}
        }catch(error : any){
            console.error(error);
            return false;
        }
        
    
 }

   formatTime(time: Time): string {
      const hours = time.hours.toString().padStart(2, '0');
      const minutes = time.minutes.toString().padStart(2, '0');
      return `${hours}:${minutes}`;
   }

   cerrarModales() {
      this.modalMFechas.hide();
      this.modalMConfirmacion.hide();
   }














}
