
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { Usuario } from 'src/app/interfaces/Usuario';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { HorarioService } from 'src/app/services/horario.service';
import { Horario } from 'src/app/interfaces/Horario';
import { TurnoService } from 'src/app/services/turno.service';
import { Turno } from 'src/app/interfaces/Turno';
import { Time } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { first, firstValueFrom } from 'rxjs';
import { SharedFunctions } from 'src/app/utils/SharedFunctions';





@Component({
   selector: 'app-registrar-turno',
   templateUrl: './registrar-turno.component.html',
   styleUrls: ['./registrar-turno.component.css']
})
export class RegistrarTurnoComponent implements OnInit {


   loading: boolean = false;
   listEspecialidad: Especialidad[] = [];
   listProfesional: Usuario[] = [];
   errorServer: string | null = null;
   form: FormGroup;
   form_profesional: FormGroup;
   fechaTurno: string | null = null;

   fechaTurnoDate: Date = new Date();
   horaTurno: Time | undefined;
   horariosDisponibles: string[] = [];
   mostrarHorarios: boolean = false;
   horarioProfesional: Horario | undefined;
   profesional: Usuario = {};
   listTurnos: Turno[] = [];
   especialidad: Especialidad | undefined;
   fechaTurnoString: string | null = null;
   horaString: string | null = null;
   paciente: Usuario | undefined;

   fechaMinima: NgbDateStruct = { year: 0, month: 0, day: 0 };

   idPaciente : number = 0;
   payload : any;

   diasHorarioProfesional : string[] = [];
   markDisabled: any = null;




   constructor(private _especialidadService: EspecialidadService,
      private toastr: ToastrService,
      private _usuarioService: UsuarioService,
      private _horarioService: HorarioService,
      private _turnoService: TurnoService,
      private fb: FormBuilder,
      private router: Router,
      private _authService: AuthService,
      private sharedFunctions: SharedFunctions,
      private aRouter : ActivatedRoute


   ) {
      this.form = this.fb.group({
         id_especialidad: ['', Validators.required]
      });
      this.form_profesional = this.fb.group({
         id_profesional: ['', Validators.required]
      })

      this.idPaciente = Number(this.aRouter.snapshot.paramMap.get('id'));

   }

   async ngOnInit(): Promise<void> {
      await this.getPaciente();
      await this.getListEspecialidad();
      this.deshabilitarFechas();


   }


   async getPaciente() {
      try {
         this.loading = true;
         const token: string = localStorage.getItem('auth-token')!;
         const data: any = await firstValueFrom(this._authService.verifyToken(token));


         const payload = data;
         this.payload = payload;
         if(payload.rol === 2){
            this.paciente = await firstValueFrom(this._usuarioService.getOne(this.idPaciente));
         } else {
               
            this.paciente = await firstValueFrom(this._usuarioService.getOne(payload.id));
         }

      
        
         this.loading = false;
     
      } catch (error) {
         this.loading = false;
         this.errorServer = (error as any)?.error || 'Error al obtener Paciente';
         this.toastr.error(this.errorServer!, 'Error');
      }
   }


   async getListEspecialidad() {
      this.loading = true;

      try {
         const data = await firstValueFrom(this._especialidadService.getAll());
         this.loading = false;
         this.listEspecialidad = data;

      } catch (error: any) {
         this.loading = false;
         this.errorServer = error.error?.error;
         console.error(this.errorServer);
         this.toastr.error(this.errorServer!, 'Error');
      }

   }

   //Obtengo todos los profesionales de la Especialidad seleccionada y Obra Social del paciente logueado
   async getListProfesional() {
      try {
         this.loading = true;

         const data: Usuario[] | undefined = await firstValueFrom(this._usuarioService.getProfesionalesByEspecialidadAndObraSocial(Number(this.form.value.id_especialidad), this.paciente?.id_obra_social!));

         this.loading = false;

         if (data !== undefined) {
            this.listProfesional = data;

         } else {
            console.error('El servicio devolvió undefined.');
         }
      } catch (error) {
         this.loading = false;

         // Verificar si 'error' es una cadena
         if (typeof error === 'string') {
            this.errorServer = error;
         } else {
            // Si 'error' no es una cadena, asignar un mensaje de error predeterminado
            this.errorServer = 'Error al obtener Profesionales';
         }

         console.error(this.errorServer);
         this.toastr.error(this.errorServer, 'Error');
      }
   }


   getEspecialidad() {
      this.loading = true;
      const id_especialidad = Number(this.form.value.id_especialidad);
      this.especialidad = this.listEspecialidad.find((esp) => esp.id === id_especialidad);
      this.loading = false;
   }

   async modalProfesional(): Promise<void> {
     
      await this.getListProfesional();

      // Restablecer el valor seleccionado del formulario a null
      this.form_profesional.patchValue({ id_profesional: null });

      if (this.listProfesional.length === 0) {
         this.toastr.error('No existen profesionales con su Obra Social y la Especialidad indicada', 'Error');
         return;
      }

      this.getEspecialidad();

      const modalElement: any = document.getElementById('modalProfesional');
      if (modalElement) {
         const modal = new Modal(modalElement);
         modal.show();
      }


   }



   setId() {
      this.form_profesional.reset();

   }


   //Obtengo el profesional seleccionado
   async getProfesional() {

      this.loading = true;


      this.profesional = this.listProfesional.find((pro) => pro.id === Number(this.form_profesional.value.id_profesional))!;


      this.loading = false;
   }



   //Obtengo el horario del profesional seleccionado
   async getHorarioProfesional() {
      this.loading = true;
      try {
         const data: Horario = await firstValueFrom(this._horarioService.getOne(this.profesional.id_horario!));
         this.horarioProfesional = data;
         

         //Dias profesional
         this.getDiasProfesional();
         this.onCalendarShown();
         
         this.loading = false;
      } catch (error: any) {
         this.loading = false;
         this.errorServer = error.error?.error || 'Error al obtener Horario del Profesional';
         this.toastr.error(this.errorServer!, 'Error');
      }


   }

     //Habilitar solo los dias que trabaja el medico en el calendario
   getDiasProfesional(){
        // Convertir el número del día de la semana a una cadena de texto
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

      this.diasHorarioProfesional = diasHorarioProfesional;

      console.log('Dias this horario: ', this.diasHorarioProfesional);
   }

     // Función para filtrar los días seleccionables
  filtrarDiasSeleccionables = (date: NgbDate) => {
   const currentDate = new Date(date.year, date.month - 1, date.day);
   const diaSemana = currentDate.getDay(); // 0 para domingo, 1 para lunes, etc.
   console.log('Filtrar dias Seleccionables: ',!this.diasHorarioProfesional.includes(this.obtenerNombreDia(diaSemana)));
   return !this.diasHorarioProfesional.includes(this.obtenerNombreDia(diaSemana));
   
 };

 // Función para obtener el nombre del día
 obtenerNombreDia(diaNumero: number): string {
   const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
   return diasSemana[diaNumero];
 }

 onCalendarShown() {
   // Configurar markDisabled al mostrar el calendario
   this.markDisabled = this.filtrarDiasSeleccionables;
 }


   //Genero modal de fechas
   async modalFechas(): Promise<void> {
    
      if (this.form_profesional.value.id_profesional === '') {
         this.toastr.error('Seleccione profesional para continuar', '');
      } else {
         await this.getProfesional();
         if (this.profesional === undefined) {
          
            this.loading = false;
            const error = new Error('Error al obtener Profesional');
            this.toastr.error(error.message, 'Error');
            return;

         }
         await this.getHorarioProfesional();
          //Aca ver de generar una variable con los dias que trabaja el profesional

         const modalElement: any = document.getElementById('modalFechas');
         if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
            this.mostrarHorarios = false;
         }
      }


   }

   deshabilitarFechas() {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1); // Obtener el día siguiente al actual
  
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1;
      let day = currentDate.getDate();
  
      // Si el día es mayor que el último día del mes actual, avanzamos al próximo mes
      if (day > new Date(year, month, 0).getDate()) {
          day = 1; // Establecemos el día en el primero del próximo mes
          month++; // Avanzamos al próximo mes
          if (month > 12) {
              month = 1; // Si hemos superado diciembre, establecemos el mes en enero
              year++; // Avanzamos al próximo año
          }
      }
  
      // Asignamos la fecha mínima
      this.fechaMinima = new NgbDate(year, month, day);
  
      console.log('Fecha mínima:', this.fechaMinima);
  }

 

   // Funcion que se ejecuta cuando se clickea un día en el calendario
   async seleccionarDia(event: { year: number; month: number; day: number }): Promise<void> {
      this.horariosDisponibles = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
      this.mostrarHorarios = false;

      // Crear un objeto NgbDate con las propiedades requeridas
      const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

      this.fechaTurnoDate = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day);

      // Formatear la fecha como 'yyyy-mm-dd'
      const fechaFormateada: string = this.sharedFunctions.formatearFecha(fechaSeleccionada);

      // Formatear fecha a dd/mm/yyyy
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
         if (this.listTurnos.length != 0) {
            this.modificarArrayHorarios();
         }

         this.mostrarHorarios = true;
      }


   }


   //Devuelve los turnos del profesional seleccionado en el dia seleccionado
   async getHorariosOcupados(fecha: string): Promise<Turno[]> {
      this.loading = true;
      const idProfesional = Number(this.form_profesional.value.id_profesional)
      try {
         const data = await firstValueFrom(this._turnoService.getByProfesionalAndFecha(idProfesional, fecha));

         this.loading = false;
         this.listTurnos = data!

         return data!;
      } catch (error) {
         this.loading = false;
         this.toastr.error('Error al obtener Turnos disponibles', 'Error');
         throw error;
      }


   }

   //Recorre los turnos del profesional en el dia seleccionado eliminando de los horarios que se mostraran para seleccionar aquellos que no esten disponibles
   async modificarArrayHorarios(): Promise<void> {
      this.loading = true;
      try {
         this.listTurnos.forEach((turno) => {
            const horaString: string = turno.hora.toString();
            if (this.horariosDisponibles.some((horaButton) => horaButton === this.formatearHora(horaString))) {
               const horaIndex = this.horariosDisponibles.indexOf(this.formatearHora(horaString));
               if (horaIndex !== -1) {
                  this.horariosDisponibles.splice(horaIndex, 1);
               }
            }

         })
      } finally {
         this.loading = false;
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

   modalTurno(horario: string): void {
      // Puedes realizar acciones con el horario seleccionado, por ejemplo, almacenarlo en una variable
   

      this.horaString = horario;
      // Convertir el string de hora a un objeto Time
      const [horas, minutos] = horario.split(':');
      this.horaTurno = { hours: parseInt(horas, 10), minutes: parseInt(minutos, 10) };

      // Puedes realizar acciones adicionales con la hora seleccionada, si es necesario

      const modalElement: any = document.getElementById('modalTurno');
      if (modalElement) {
         const modal = new Modal(modalElement);
         modal.show();
      }


   }

   formatFechaLocal(fecha: string): string {
      const elementos = fecha.split('-');
      const fechaLocal: string = `${elementos[2]}/${elementos[1]}/${elementos[0]}`;

      return fechaLocal;
   }

   formatTime(time: Time): string {
      const hours = time.hours.toString().padStart(2, '0');
      const minutes = time.minutes.toString().padStart(2, '0');
      return `${hours}:${minutes}`;
   }

   async createTurno() {
      this.loading = true;
      const fecha = this.sharedFunctions.formatoFechaDB(this.fechaTurnoDate);
      const hora = this.formatTime(this.horaTurno!);

      if (await this.validaTurnoRepetido(fecha, hora)) {
         const turno: Turno = {
            fecha: fecha,
            hora: hora,
            estado: 'Pendiente',
            observaciones: '',
            id_profesional: this.profesional.id!,
            id_paciente: this.paciente?.id!

         };

         try {
            await firstValueFrom(this._turnoService.create(turno));
            this.loading = false;
            this.closeModal();
            if(this.payload.rol === 2){
               this.router.navigate(['pacientes']);
            } else {
               this.router.navigate(['mis-turnos']);
            }
         
            this.toastr.success('Turno generado exitosamente!');

            // this.router.navigate(['']);
            // this.toastr.success('Turno generado exitosamente', 'Turno Generado');

         } catch (error: any) {
            this.loading = false;
            console.error(error);
            this.errorServer = error.error?.error || 'Error al generar Turno',
               this.toastr.error(this.errorServer!, 'Error');
         }

      } else {
         this.loading = false;
         this.toastr.error('No es posible registrar mas de un turno en la misma fecha y hora', 'Error');


      }


   }
   //Valida que el paciente no tenga registrado un turno en misma fecha y hora
   async validaTurnoRepetido(fecha: string, hora: string): Promise<boolean> {

      const body = {
         fecha: fecha,
         hora: hora
      };
      try {
         const turno = await firstValueFrom(this._turnoService.getTurnoByPacFechaHora(body, this.paciente?.id!));
      
         if (turno.length > 0) {

            return false;
         } else { return true; }
      } catch (error: any) {
         console.error(error);
         return false;
      }


   }


   closeModal() {
      // Cerrar el primer modal
      const modalProfesional = document.getElementById('modalProfesional');
      if (modalProfesional) {
   
         modalProfesional.classList.remove('show');
      }

      // Cerrar el segundo modal
      const modalFechas = document.getElementById('modalFechas');
      if (modalFechas) {
       
         modalFechas.classList.remove('show');
      }

      // Cerrar el tercer modal
      const modalTurno = document.getElementById('modalTurno');
      if (modalTurno) {
      
         modalTurno.classList.remove('show');
      }

      // Eliminar todos los backdrops
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => {
      
         backdrop.remove();
      });


   }


}

















