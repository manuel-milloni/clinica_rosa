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
   fechaTurno: Date = new Date();
   horariosDisponibles: string[] = [];
   mostrarHorarios: boolean = false;
   horarioProfesional: Horario | undefined;
   profesional: Usuario = {};
   listTurnos : Turno[] = [];



   constructor(private _especialidadService: EspecialidadService,
      private toastr: ToastrService,
      private _usuarioService: UsuarioService,
      private _horarioService: HorarioService,
      private _turnoService : TurnoService,
      private fb: FormBuilder
   ) {
      this.form = this.fb.group({
         id_especialidad: ['', Validators.required]
      });
      this.form_profesional = this.fb.group({
         id_profesional: ['', Validators.required]
      })
   }

   async ngOnInit(): Promise<void> {
      await this.getListEspecialidad();
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

   getListProfesional() {
      this.loading = true;

      this._usuarioService.getProfesionalesByEspecialidad(Number(this.form.value.id_especialidad)).subscribe((data: Usuario[]) => {
         this.loading = false;
         this.listProfesional = data;
      }, (error) => {
         this.loading = false;
         this.errorServer = error.error?.error || 'Error al obtener Profesionales';
         console.error(this.errorServer);
         this.toastr.error(this.errorServer!, error);
      })
   }

   async modalProfesional(): Promise<void> {
      await this.getListProfesional();
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
   async seleccionarDia(event: { year: number; month: number; day: number }): Promise<void> {

      this.horariosDisponibles = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
      // Crear un objeto NgbDate con las propiedades requeridas
      const fechaSeleccionada: NgbDate = { year: event.year, month: event.month, day: event.day } as NgbDate;
      console.log('Fecha seleccionada:', fechaSeleccionada);

      // Obtener los componentes de la fecha
      const year = fechaSeleccionada.year;
      const month = fechaSeleccionada.month;
      const day = fechaSeleccionada.day;

      // Formatear la fecha como 'yyyy-mm-dd'
      const fechaFormateada: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      console.log('Fecha seleccionada:', fechaFormateada);

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

     

      if(diasHorarioProfesional.some((dia) => dia === nombreDia)){
               
               await this.getHorariosOcupados(fechaFormateada);
               await this.modificarArrayHorarios();
               this.mostrarHorarios = true;

      }


    


      // Añadir lógica adicional según tus necesidades


      // Mostrar los botones de horarios
     // this.mostrarHorarios = diasHorarioProfesional.some((dia) => dia === nombreDia);
   }

    //Devuelve los turnos del profesional seleccionado en el dia seleccionado
   async getHorariosOcupados(fecha : string): Promise<Turno[]>{
        this.loading = true;
        const idProfesional = Number(this.form_profesional.value.id_profesional)
        try{
           const data = await this._turnoService.getByProfesionalAndFecha(idProfesional, fecha).toPromise();
           this.loading = false;
           this.listTurnos = data!
            return  data!;
        } catch(error){
             this.loading = false;
             this.toastr.error('Error al obtener Turnos disponibles', 'Error');
             throw error;
        }
      
      
   }

     //Recorre los turnos del profesional en el dia seleccionado eliminando de los horarios que se mostraran para seleccionar aquellos que no esten disponibles
   async modificarArrayHorarios(): Promise<void>{
         this.loading = true;
         try{
            this.listTurnos.forEach((turno)=>{
               const horaString: string = turno.hora.toString();
               if(this.horariosDisponibles.some((horaButton)=> horaButton === this.formatearHora(horaString))) {
                      const horaIndex = this.horariosDisponibles.indexOf(this.formatearHora(horaString));
                      if(horaIndex !== -1){
                          this.horariosDisponibles.splice(horaIndex, 1);
                      }
               }
               
        })
         }finally {
             this.loading = false;
         }
       
        
   }


   seleccionarHorario(horario: string): void {
      // Puedes realizar acciones con el horario seleccionado, por ejemplo, almacenarlo en una variable
      console.log('Horario seleccionado:', horario);
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
    
    
    
     

   //Cuando se clicke un dia el sistema debe:
   //-El dia actual los botones deben aparecer siempre deshabilitados(es decir el sistema no debe permitir sacar turnos para el mismo dia)
   //-Traer botones de 9 a 18hs (ejemplo 09:00, 09:30, y asi hasta las 18) figurando habilitados solo los horarios del dia disponibles para turno con dicho profesional
   //por ende debo validar primero si el dia seleccionado es un dia que forma parte del horario del pro, si no lo es muestro todos los boton deshabilitados pero si es
   //muestro los botones en los horarios que no haya turno





}
