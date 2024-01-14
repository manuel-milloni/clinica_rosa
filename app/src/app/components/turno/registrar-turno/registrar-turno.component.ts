import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { Usuario } from 'src/app/interfaces/Usuario';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { HorarioService } from 'src/app/services/horario.service';
import { Horario } from 'src/app/interfaces/Horario';
import { TurnoService } from 'src/app/services/turno.service';
import { Turno } from 'src/app/interfaces/Turno';
import { Time } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
   
   fechaTurnoDate : Date = new Date();
   horaTurno: Time | undefined;
   horariosDisponibles: string[] = [];
   mostrarHorarios: boolean = false;
   horarioProfesional: Horario | undefined;
   profesional: Usuario = {};
   listTurnos: Turno[] = [];
   especialidad: Especialidad | undefined;
   fechaTurnoString: string | null = null;
   horaString: string | null = null;
   paciente : Usuario | undefined;



   constructor(private _especialidadService: EspecialidadService,
      private toastr: ToastrService,
      private _usuarioService: UsuarioService,
      private _horarioService: HorarioService,
      private _turnoService: TurnoService,
      private fb: FormBuilder,
      private router: Router,
      private _authService : AuthService
   ) {
      this.form = this.fb.group({
         id_especialidad: ['', Validators.required]
      });
      this.form_profesional = this.fb.group({
         id_profesional: ['', Validators.required]
      })
       
   }

   async ngOnInit(): Promise<void> {
      await this.getPaciente();
      await this.getListEspecialidad();
    
   
   }

   async getPaciente() {
      try {
        this.loading = true;
        const token: string = localStorage.getItem('auth-token')!;
        const data: any = await this._authService.verifyToken(token).toPromise();
    
        const payload = data;
        this.paciente  = await this._usuarioService.getOne(payload.id).toPromise();
    
        this.loading = false;
        console.log('Data usuario: ', this.paciente);
      } catch (error) {
        this.loading = false;
        this.errorServer = (error as any)?.error || 'Error al obtener Paciente';
        this.toastr.error(this.errorServer!, 'Error');
      }
    }
    

   getListEspecialidad() {
      this.loading = true;
      this._especialidadService.getAll().subscribe((data: Especialidad[]) => {
         this.loading = false;
         this.listEspecialidad = data;
      }, (error) => {
         this.loading = false;
         this.errorServer = error.error?.error;
         console.error(this.errorServer);
         this.toastr.error(this.errorServer!, 'Error');
      })
   }
   //Obtengo todos los profesionales de la Especialidad seleccionada y Obra Social del paciente logueado
   getListProfesional() {
      this.loading = true;

      this._usuarioService.getProfesionalesByEspecialidadAndObraSocial(Number(this.form.value.id_especialidad), this.paciente?.id_obra_social!).subscribe((data: Usuario[]) => {
         this.loading = false;
         this.listProfesional = data;
      }, (error) => {
         this.loading = false;
         this.errorServer = error.error?.error || 'Error al obtener Profesionales';
         console.error(this.errorServer);
         this.toastr.error(this.errorServer!, error);
      })
   }

   getEspecialidad() {
      this.loading = true;
      const id_especialidad = Number(this.form.value.id_especialidad);
      this.especialidad = this.listEspecialidad.find((esp) => esp.id === id_especialidad);
      this.loading = false;
   }

   async modalProfesional(): Promise<void> {
      await this.getListProfesional();
      this.getEspecialidad();
      console.log('Profesionales: ', this.listProfesional);
      const modalElement: any = document.getElementById('modalProfesional');
      if (modalElement) {
         const modal = new Modal(modalElement);
         modal.show();
      }
   }


   //Obtengo el profesional seleccionado
   getProfesional() {
      this.loading = true;


      this.profesional = this.listProfesional.find((pro) => pro.id === Number(this.form_profesional.value.id_profesional))!;

      this.loading = false;
   }

   //Obtengo el horario del profesional seleccionado
   getHorarioProfesional() {
      this.loading = true;
      this._horarioService.getOne(this.profesional.id_horario!).subscribe((data: Horario) => {
         this.horarioProfesional = data;
         this.loading = false;
      }, (error) => {
         this.loading = false;
         this.errorServer = error.error?.error || 'Error al obtener Horario del Profesional';
         this.toastr.error(this.errorServer!, 'Error');

      })

   }




   //Genero modal de fechas

   async modalFechas(): Promise<void> {
      await this.getProfesional();
      await this.getHorarioProfesional();

      console.log('Contenido del form profesional:  ', this.form_profesional);
      console.log('Modal fechas press');
      const modalElementAnt: any = document.getElementById('modalProfesional');
      if (modalElementAnt) {
         const modal = new Modal(modalElementAnt);
         modal.dispose();
      }
      const modalElement: any = document.getElementById('modalFechas');
      if (modalElement) {
         const modal = new Modal(modalElement);
         modal.show();
         this.mostrarHorarios = false;
      }
   }

   //Funcion que se ejecuta cuando se clickea un dia en el calendario
//...

// Funcion que se ejecuta cuando se clickea un día en el calendario
async seleccionarDia(event: { year: number; month: number; day: number }): Promise<void> {
   this.horariosDisponibles = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
   this.mostrarHorarios = false;

   // Crear un objeto NgbDate con las propiedades requeridas
   const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);
   

   this.fechaTurnoDate = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day);
   
  
   

   console.log('Fecha seleccionada:', fechaSeleccionada);

    // Obtener los componentes de la fecha
    const year = fechaSeleccionada.year;
    const month = fechaSeleccionada.month;
    const day = fechaSeleccionada.day;

   // Formatear la fecha como 'yyyy-mm-dd'
      // Formatear la fecha como 'yyyy-mm-dd'
      const fechaFormateada: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      console.log('Fecha seleccionada formateada:', fechaFormateada);
   console.log('Fecha seleccionada formateada:', fechaFormateada);

   // Asignar solo como cadena
   this.fechaTurnoString = this.formatNgbDate(this.fechaTurnoDate);
   this.fechaTurno = this.formatNgbDate(this.fechaTurnoDate);

   console.log('Fecha Turno en Seleccionar dia: ', this.fechaTurno);

   // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
   const diaDeLaSemana: number = new Date(fechaSeleccionada.year, fechaSeleccionada.month - 1, fechaSeleccionada.day).getDay();

   // Convertir el número del día de la semana a una cadena de texto
   const diasSemana: string[] = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
   const nombreDia: string = diasSemana[diaDeLaSemana];
   const diasHorarioProfesional = [];
   console.log('Día de la semana:', nombreDia);
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
      this.mostrarHorarios = true;
   }

   console.log('ultima linea de seleccionar dia: ', this.fechaTurno);
}

formatNgbDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

//...


   //Devuelve los turnos del profesional seleccionado en el dia seleccionado
   async getHorariosOcupados(fecha: string): Promise<Turno[]> {
      this.loading = true;
      const idProfesional = Number(this.form_profesional.value.id_profesional)
      try {
         const data = await this._turnoService.getByProfesionalAndFecha(idProfesional, fecha).toPromise();
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
         console.log('Hora no definida:', time);
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
       console.log('Fecha en modal turno: ', this.fechaTurno);
       


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

   formatTime(time: Time): string {
      const hours = time.hours.toString().padStart(2, '0');
      const minutes = time.minutes.toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

   createTurno() {
      this.loading = true;
      const fecha = this.formatNgbDate(this.fechaTurnoDate);
      const hora = this.formatTime(this.horaTurno!);
      const turno : Turno ={
         fecha: fecha,
         hora: hora,
         estado: 'pendiente',
         observaciones: '',
         id_profesional: this.profesional.id!,
         id_paciente: this.paciente?.id!

      };
      this._turnoService.create(turno).subscribe(() => {
         this.loading = false;
         this.router.navigate(['']);
         this.toastr.success('Turno generado exitosamente', 'Turno Generado');
      }, (error) => {
         this.loading = false;
         this.errorServer = error.error?.error || 'Error al generar Turno',
            this.toastr.error(this.errorServer!, 'Error');
      })

   }

      //revisar, no funciona cuando vuelvo hacia atras hasta este modal
   cerrarModalProfesional(){
      const modalElement: any = document.getElementById('modalProfesional');
      if (modalElement) {
         
         modalElement.dispose();
      }
   }





   //Cuando se clicke un dia el sistema debe:
   //-El dia actual los botones deben aparecer siempre deshabilitados(es decir el sistema no debe permitir sacar turnos para el mismo dia)
   //-Traer botones de 9 a 18hs (ejemplo 09:00, 09:30, y asi hasta las 18) figurando habilitados solo los horarios del dia disponibles para turno con dicho profesional
   //por ende debo validar primero si el dia seleccionado es un dia que forma parte del horario del pro, si no lo es muestro todos los boton deshabilitados pero si es
   //muestro los botones en los horarios que no haya turno





}
