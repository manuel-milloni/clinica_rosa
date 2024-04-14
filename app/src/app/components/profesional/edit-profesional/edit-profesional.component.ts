import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Validations } from 'src/app/utils/Validations';
import { ObrasocialService } from 'src/app/services/obrasocial.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { HorarioService } from 'src/app/services/horario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/Usuario';
import { Horario } from 'src/app/interfaces/Horario';
import { Usuario_obra_social } from 'src/app/interfaces/Usuario_obra_social';
import { Observable, firstValueFrom } from 'rxjs';
import { TurnoService } from 'src/app/services/turno.service';
import { SharedFunctions } from 'src/app/utils/SharedFunctions';
import { Turno } from 'src/app/interfaces/Turno';

@Component({
  selector: 'app-edit-profesional',
  templateUrl: './edit-profesional.component.html',
  styleUrls: ['./edit-profesional.component.css']
})
export class EditProfesionalComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  listObraSocial: ObraSocial[] = [];
  listEspecialidad: Especialidad[] = [];
  listHoras: string[] = [];
  listHorasDesde: string[] = [];
  listHorasHasta: string[] = [];
  id_horario: number = 0;
  id_profesional: number = 0;
  listObraSocialProfesional: ObraSocial[] = [];
  profesional: Usuario = {};
  turnosPendientes: boolean = false;
  updateProfesional : boolean = false;

  constructor(private _usuarioService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _obraSocialService: ObrasocialService,
    private _especialidadService: EspecialidadService,
    private _horarioService: HorarioService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private _turnoService: TurnoService,
    private sharedFunctions: SharedFunctions) {

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(20)]],
      dni: ['', [Validators.required, Validators.maxLength(10)]],
      telefono: ['', Validators.maxLength(15)],
      matricula: ['', [Validators.required, Validators.maxLength(10)]],
      id_especialidad: ['', Validators.required],

      obrasSociales: this.fb.array([], { validators: [Validations.atLeastOneObraSocialSelectedEdit()] }),
      horaDesde: ['', Validators.required],
      horaHasta: ['', Validators.required],
      lunes: [false],
      martes: [false],
      miercoles: [false],
      jueves: [false],
      viernes: [false]


    }, { validator: Validations.validateCheckboxs() })

  }


  async ngOnInit(): Promise<void> {
    this.id_profesional = Number(this.aRouter.snapshot.paramMap.get('id'));

    await this.getProfesional(this.id_profesional);
    await this.getListObraSocial();
    this.generateListHoras();
    this.generateListHorasDesde();
    this.generateListHorasHasta(this.form.value.horaDesde);

    this.form.get('horaDesde')?.valueChanges.subscribe((horaDesde: string) => {
      this.updateHorasHasta(horaDesde);
    });

    await this.getListEspecialidad();
    await this.getObrasSociales(this.id_profesional);
    this.updateObrasSocialesArrayForm();



  }

  async getProfesional(id: number) {
    this.loading = true;
    try {
      const profesional: Usuario = await firstValueFrom(this._usuarioService.getOne(id));

      const especialidad: Especialidad = await firstValueFrom(this._especialidadService.getOne(profesional.id_especialidad!));

      this.form.patchValue({
        id_especialidad: especialidad.id
      });

      const horario: Horario = await firstValueFrom(this._horarioService.getOne(profesional.id_horario!));

      // Convertir las cadenas de horas a objetos Date
      const horaDesde = new Date(`1970-01-01T${horario.horaDesde}`);
      const horaHasta = new Date(`1970-01-01T${horario.horaHasta}`);

      // Formatear las horas como cadenas HH:mm
      const horaDesdeString = this.formatTime(horaDesde);
      const horaHastaString = this.formatTime(horaHasta);

      // Asignar valores al formulario
      this.form.patchValue({
        horaDesde: horaDesdeString,
        horaHasta: horaHastaString,
        lunes: horario.lunes,
        martes: horario.martes,
        miercoles: horario.miercoles,
        jueves: horario.jueves,
        viernes: horario.viernes
      });




      this.form.patchValue({
        nombre: profesional.nombre,
        apellido: profesional.apellido,
        dni: profesional.dni,
        telefono: profesional.telefono,
        matricula: profesional.matricula,

      });
      profesional.horario = horario;
      profesional.especialidad = especialidad.nombre;
      this.profesional = profesional;
      this.loading = false;


    } catch (error) {
      this.loading = false;
      console.error(error);
      this.toastr.error('Error al obtener Profesional', 'Error');
    };
  }

  async update() {

    const horario: Horario = {
      horaDesde: this.form.value.horaDesde,
      horaHasta: this.form.value.horaHasta,
      lunes: this.form.value.lunes,
      martes: this.form.value.martes,
      miercoles: this.form.value.miercoles,
      jueves: this.form.value.jueves,
      viernes: this.form.value.viernes
    };

    if (this.validaObrasSociales() && this.validaHorarios(horario)) {
      console.log('Obras sociales y horarios sin cambios');
      this.updateProfesional = true;

    } else {
      //Validar si hay turnos pendientes
      console.log('Se detectaron cambios en las obras sociales o en los horarios');
      await this.validaTurnosPendientes();
      if (this.turnosPendientes) {
        console.log('No tiene turnos pendientes');
        this.updateProfesional = true;
 

      } else {

        this.toastr.error('No es posible modificar los campos Horario y Obra Social cuando el Profesional tiene turnos pendientes');
        return;

      }
    }

      if(this.updateProfesional){
        try {
          //Crea horario, si ya existe devuelve id del horario y lo asigna al body
          const data: Horario = await firstValueFrom(this.addHorario(horario));
          this.id_horario = data.id!;
          const profesional: Usuario = {

            nombre: this.form.value.nombre,
            apellido: this.form.value.apellido,
            dni: this.form.value.dni,
            telefono: this.form.value.telefono,
            password: this.form.value.password,
            matricula: this.form.value.matricula,
            id_especialidad: this.form.value.id_especialidad,
            id_horario: this.id_horario,
            obras_sociales: this.form.value.obrasSociales

          };
          console.log('Usuario: ,', profesional);
          await firstValueFrom(this._usuarioService.updateProfesional(this.id_profesional, profesional));
          this.router.navigate(['/profesional']);
          this.toastr.success('Usuario modificado exitosamente', 'Usuario');

        } catch (error) {
          console.error(error);
          this.toastr.error('Error al modificar usuario', 'Error');
        }
      



    }




  }

  //Valida si hubo modificaciones en el horario (retorna true cuando no se modifico el horario y false cuando los horarios no son iguales)
  validaHorarios(horario: Horario): boolean {
    const horaDesde: any = this.profesional.horario?.horaDesde.toString().substring(0, 5);
    const horaHasta: any = this.profesional.horario?.horaHasta.toString().substring(0, 5);
    if (horaDesde !== horario.horaDesde) {
      return false;
    } else if (horaHasta !== horario.horaHasta) {
      return false;
    } else if (horario.lunes !== this.profesional.horario?.lunes) {
      return false;
    } else if (horario.martes !== this.profesional.horario?.martes) {
      return false;
    } else if ((horario.miercoles !== this.profesional.horario?.miercoles)) {
      return false;
    } else if (horario.jueves !== this.profesional.horario?.jueves) {
      return false;
    } else if (horario.viernes !== this.profesional.horario?.viernes) {
      return false;
    } else {
      return true;
    }

  }

  //Valida si hubo cambios en las obras sociales del Profesional
  validaObrasSociales(): boolean {
    const obrasSocialesProfesional = this.listObraSocialProfesional.map((obrasocial) => {
      return obrasocial.id;
    });

    if (this.form.value.obrasSociales.length === obrasSocialesProfesional.length) {
      return obrasSocialesProfesional.every(item => this.form.value.obrasSociales.includes(item));
    } else {
      return false;
    }
  }

  async validaTurnosPendientes() {
    const fecha = new Date();
    const fechaString = this.sharedFunctions.formatoFechaDB(fecha);
    const body = {
      fecha: fechaString,
      estado: 'Pendiente'
    };

    try {
      const turnosPendientes: Turno[] = await firstValueFrom(this._turnoService.getTurnosByProfesional(body, this.profesional.id!));
      this.turnosPendientes = !(turnosPendientes.length != 0);
    } catch (error) {
      console.error(error);
      this.toastr.error('Error al validar turnos pendientes', 'Error');

    }
  }

  //Trae todas las os
  async getListObraSocial() {
    this.loading = true;
    try {
      const data: ObraSocial[] = await firstValueFrom(this._obraSocialService.getAll());
      this.listObraSocial = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error(error);
      this.toastr.error('Error al obtener Obras Sociales', 'Error');
    }

  }

  async getListEspecialidad() {
    this.loading = true;
    try {
      const data: Especialidad[] = await firstValueFrom(this._especialidadService.getAll());
      this.loading = false;
      this.listEspecialidad = data;
    } catch (error) {
      this.loading = false;
      console.error(error);
      this.router.navigate(['/profesional-add']);
      this.toastr.error('Error al obtener Especialidades', 'Error');
    }


  }

  generateListHoras() {
    for (let hora = 9; hora <= 18; hora++) {
      const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
      this.listHoras.push(`${horaFormateada}:00`);
    }
  }

  generateListHorasDesde() {
    this.listHorasDesde = this.listHoras.filter(hora => hora !== '18:00');
  }

  updateHorasHasta(horaDesde: string) {
    const horaDesdeSelect = this.listHoras.indexOf(horaDesde);

    this.listHorasHasta = this.listHoras.slice(horaDesdeSelect + 1);

  }

  generateListHorasHasta(horaDesde: string) {
    // extraer la hoa desde el string horaDesde
    const hora = parseInt(horaDesde.substring(0, 2));

    // genear las horas hasta 18:00 en incrementos de una hora
    this.listHorasHasta = [];
    for (let i = hora + 1; i <= 18; i++) {
      const horaFormateada = i < 10 ? `0${i}` : `${i}`;
      this.listHorasHasta.push(`${horaFormateada}:00`);
    }


  }

  async getObrasSociales(id: number): Promise<void> {
    this.loading = true;
    try {
      const data: Usuario_obra_social[] = await firstValueFrom(this._usuarioService.getObrasSociales(id));


      if (data) {
        console.log("Data de obras sociales:", data);

        for (const item of data) {
          console.log("Item de obra social:", item);

          const os: ObraSocial = await firstValueFrom(this._obraSocialService.getOne(item.id_obra_social));

          if (os) {
            this.listObraSocialProfesional.push(os);
          } else {
            console.error("El servicio de obra social no devolvió datos para el ID:", item.id_obra_social);
          }
        }

        console.log("Obras sociales del pro: ", this.listObraSocialProfesional);
      } else {
        console.error("El servicio no devolvió datos.");
      }
    } catch (error) {
      this.loading = false;
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  //Obras sociales
  toggleObraSocial(obraSocialId: number) {
    const obrasSocialesArray = this.form.get('obrasSociales') as FormArray;

    // Verifica si la obra social ya está en la lista obtenida
    const obraSocialIndex = obrasSocialesArray.controls.findIndex(control => control.value === obraSocialId);

    // Si está en la lista obtenida, quítala; de lo contrario, agrégala
    if (obraSocialIndex !== -1) {
      obrasSocialesArray.removeAt(obraSocialIndex);
    } else {
      obrasSocialesArray.push(this.fb.control(obraSocialId));
    }

    this.form.updateValueAndValidity();

    console.log('Form array después del toggle: ', obrasSocialesArray);
  }


  isObraSocialSelected(obraSocialId: number): boolean {
    const obrasSocialesArray = this.form.get('obrasSociales') as FormArray;

    return (
      obrasSocialesArray.controls.some(control => control.value === obraSocialId) ||
      this.listObraSocialProfesional.some(os => os.id === obraSocialId)
    );
  }

  //Asigna en el form obrasSociales las obras sociales del profesional
  updateObrasSocialesArrayForm() {
    const obrasSocialesArray = this.form.get('obrasSociales') as FormArray;


    // Limpiar el FormArray antes de agregar los nuevos elementos
    obrasSocialesArray.clear();

    this.listObraSocialProfesional.forEach((os) => {
      obrasSocialesArray.push(this.fb.control(os.id));
    });



  }



  // Función para formatear la hora como cadena HH:mm
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  addHorario(horario: Horario): Observable<Horario> {
    return this._horarioService.create(horario);
  }



}
