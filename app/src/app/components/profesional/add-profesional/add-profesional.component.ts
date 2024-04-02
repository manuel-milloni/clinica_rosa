import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { ObrasocialService } from 'src/app/services/obrasocial.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Validations } from 'src/app/utils/Validations';
import { Horario } from 'src/app/interfaces/Horario';
import { HorarioService } from 'src/app/services/horario.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';


@Component({
  selector: 'app-add-profesional',
  templateUrl: './add-profesional.component.html',
  styleUrls: ['./add-profesional.component.css']
})
export class AddProfesionalComponent implements OnInit {
  loading: boolean = false;
  listObraSocial: ObraSocial[] = [];
  listEspecialidad: Especialidad[] = [];
  form: FormGroup;
  listHoras: string[] = [];
  listHorasDesde: string[] = [];
  listHorasHasta: string[] = [];
  id_horario: number = 0;


  constructor(private _usuarioService: UsuarioService,
    private _obraSocialService: ObrasocialService,
    private _especialidadService: EspecialidadService,
    private _horarioService: HorarioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router) {

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(20)]],
      dni: ['', [Validators.required, Validators.maxLength(10)]],
      telefono: ['', Validators.maxLength(15)],
      email: ['', [Validators.required, Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.maxLength(16)]],
      password_2: ['', [Validators.required, Validators.maxLength(16)]],
      matricula: ['', [Validators.required, Validators.maxLength(10)]],
      id_especialidad: ['', Validators.required],

      obrasSociales: this.fb.array([], { validators: [Validations.atLeastOneObraSocialSelected()] }),
      horaDesde: ['', Validators.required],
      horaHasta: ['', Validators.required],
      lunes: [false],
      martes: [false],
      miercoles: [false],
      jueves: [false],
      viernes: [false]


    }, { validator: Validations.validateCheckboxs() })

    // this.form = this.fb.group({
    //      obrasSociales : this.fb.array([])
    // }, {validator : Validations.atLeastOneObraSocialSelected()});

  }


  async ngOnInit(): Promise<void> {
    await this.getListObraSocial();
    this.generateListHoras();
    this.generateListHorasDesde();
    this.form.get('horaDesde')?.valueChanges.subscribe((horaDesde: string) => {
      this.updateHorasHasta(horaDesde);
    });
    await this.getListEspecialidad();


  }

  async getListObraSocial() {
    this.loading = true;
    try {
      const data: ObraSocial[] = await firstValueFrom(this._obraSocialService.getAll());
      this.loading = false;
      this.listObraSocial = data;
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

  async create() {
    this.loading = true;
    console.log(this.form);

    const horario: Horario = {
      horaDesde: this.form.value.horaDesde,
      horaHasta: this.form.value.horaHasta,
      lunes: this.form.value.lunes,
      martes: this.form.value.martes,
      miercoles: this.form.value.miercoles,
      jueves: this.form.value.jueves,
      viernes: this.form.value.viernes
    }
    try {
      const data: Horario = await firstValueFrom(this._horarioService.create(horario));
      this.id_horario = data.id!;
      const profesional: Usuario = {
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        dni: this.form.value.dni,
        telefono: this.form.value.telefono,
        email: this.form.value.email,
        password: this.form.value.password,
        matricula: this.form.value.matricula,
        id_especialidad: this.form.value.id_especialidad,
        id_horario: this.id_horario,
        obras_sociales: this.form.value.obrasSociales

      };

      const nuevoProfesional = await firstValueFrom(this._usuarioService.createProfesional(profesional));
      this.loading = false;
      this.router.navigate(['/profesional']);
      this.toastr.success('Usuario generado exitosamente', 'Usuario');


    } catch (error) {
      console.error(error);
      this.toastr.error('Error al generar nuevo Usuario', 'Error');
    }
    //Vieja funcion-----------------------------------------------
    //  this.addHorario(horario).subscribe( (data : Horario)=>{
    //        this.id_horario = data.id!;
    //        const profesional : Usuario = {
    //            nombre : this.form.value.nombre,
    //            apellido : this.form.value.apellido,
    //            dni : this.form.value.dni,
    //            telefono : this.form.value.telefono,
    //            email : this.form.value.email,
    //            password : this.form.value.password,
    //            matricula : this.form.value.matricula,
    //            id_especialidad : this.form.value.id_especialidad,
    //            id_horario : this.id_horario,
    //            obras_sociales : this.form.value.obrasSociales

    //        }
    //      this._usuarioService.createProfesional(profesional).subscribe((data : Usuario)=>{
    //                 const nuevoProfesional : Usuario = data;
    //                 this.loading = false;
    //                 this.router.navigate(['/profesional']);
    //                 this.toastr.success('Usuario generado exitosamente', 'Usuario');
    //      }, (error)=>{
    //                  this.loading = false;
    //                  this.errorServer = error.error?.error || 'Error al generar nuevo usuario';
    //                  console.error(this.errorServer);
    //                  this.toastr.error(this.errorServer!, 'Error');
    //      })

    //  }, (error) =>{
    //       this.errorServer = error.errror?.error || 'Error al crear Horario';
    //       console.error(this.errorServer);
    //       this.router.navigate(['/profesional-add']);
    //       this.toastr.error('Error al ingresar horario', 'Agregar Profesional');
    //  });

  }
  addHorario(horario: Horario): Observable<Horario> {

    return this._horarioService.create(horario);
  }
  
  //Obras sociales
  toggleObraSocial(obraSocialId: number) {
    const obrasSocialesArray = this.form.get('obrasSociales') as FormArray;

    // Verifica si la obra social ya está en la lista
    const obraSocialIndex = obrasSocialesArray.controls.findIndex(
      control => control.value === obraSocialId
    );

    // Si no está en la lista, agrégala; de lo contrario, quítala
    if (obraSocialIndex === -1) {
      obrasSocialesArray.push(this.fb.control(obraSocialId));
    } else {
      obrasSocialesArray.removeAt(obraSocialIndex);
    }
    this.form.updateValueAndValidity();

  }

  isObraSocialSelected(obraSocialId: number): boolean {
    const obrasSocialesArray = this.form.get('obrasSociales') as FormArray;
    return obrasSocialesArray.controls.some(
      control => control.value === obraSocialId
    );
  }

}
