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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-profesional',
  templateUrl: './edit-profesional.component.html',
  styleUrls: ['./edit-profesional.component.css']
})
export class EditProfesionalComponent implements OnInit {
  loading: boolean = false;
  errorServer: string | null = null;
  form: FormGroup;
  listObraSocial: ObraSocial[] = [];
  listEspecialidad: Especialidad[] = [];
  listHoras: string[] = [];
  listHorasDesde: string[] = [];
  listHorasHasta: string[] = [];
  id_horario: number = 0;
  id_profesional: number = 0;
  listObraSocialProfesional: ObraSocial[] = [];

  constructor(private _usuarioService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _obraSocialService: ObrasocialService,
    private _especialidadService: EspecialidadService,
    private _horarioService: HorarioService,
    private router: Router,
    private aRouter: ActivatedRoute) {

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
    this.form.get('horaDesde')?.valueChanges.subscribe((horaDesde: string) => {
      this.updateHorasHasta(horaDesde);
    });
    await this.getListEspecialidad();
    await this.getObrasSociales(this.id_profesional);
    this.updateObrasSocialesArrayForm();  
   
  

  }

  getProfesional(id: number) {
    this.loading = true;
    this._usuarioService.getOne(id).subscribe((data: Usuario) => {

      this._especialidadService.getOne(data.id_especialidad!).subscribe((espe: Especialidad) => {

        this.form.patchValue({
          id_especialidad: espe.id
        })
      }, (error) => {
        //Error al obtener especialidad del Profesional
        console.error(error);

      });

      this._horarioService.getOne(data.id_horario!).subscribe((horario: Horario) => {
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
      }, (error) => {
        //Error al obtener Horario del Profesional
        console.error(error);

      });
      this.form.patchValue({
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        telefono: data.telefono,
        matricula: data.matricula,

      });
      this.loading = false;

    }, (error) => {
      this.loading = false;
      this.errorServer = error.error?.error || 'Error al obtener el Profesional',
        this.toastr.error(this.errorServer!, 'Error');

    })
  }

  update() {
    console.log(this.form);

    const horario : Horario = {
      horaDesde : this.form.value.horaDesde,
      horaHasta : this.form.value.horaHasta,
      lunes : this.form.value.lunes,
      martes : this.form.value.martes,
      miercoles : this.form.value.miercoles,
      jueves : this.form.value.jueves,
      viernes: this.form.value.viernes
    };
     //Crea horario, si ya existe devuelve id del horario y lo asigna al body
    this.addHorario(horario).subscribe( (data : Horario)=>{
      this.id_horario = data.id!;
      const profesional : Usuario = {
          
          nombre : this.form.value.nombre,
          apellido : this.form.value.apellido,
          dni : this.form.value.dni,
          telefono : this.form.value.telefono,
          email : this.form.value.email,
          password : this.form.value.password,
          matricula : this.form.value.matricula,
          id_especialidad : this.form.value.id_especialidad,
          id_horario : this.id_horario,
          obras_sociales : this.form.value.obrasSociales

      }
    this._usuarioService.updateProfesional(this.id_profesional, profesional).subscribe(()=>{
             
               this.loading = false;
               this.router.navigate(['/profesional']);
               this.toastr.success('Usuario modificado exitosamente', 'Usuario');
    }, (error)=>{
                this.loading = false;
                this.errorServer = error.error?.error || 'Error al modificar usuario';
                console.error(this.errorServer);
                this.toastr.error(this.errorServer!, 'Error');
    })

}, (error) =>{
     this.errorServer = error.errror?.error || 'Error al crear Horario';
     console.error(this.errorServer);
     this.router.navigate(['/profesional-add']);
     this.toastr.error('Error al ingresar horario', 'Agregar Profesional');
});





  }

  //Trae todas las os
  getListObraSocial() {
    this.loading = true;
    this._obraSocialService.getAll().subscribe((data: ObraSocial[]) => {
      this.loading = false;
      this.listObraSocial = data;


    }, (error) => {
      this.loading = false;
      this.errorServer = error.error?.error || 'Error al obtener Lista de Obra Sociales';
      console.error(this.errorServer);
      this.toastr.error(this.errorServer!, 'Error');
    })
  }

  getListEspecialidad() {
    this.loading = true;
    this._especialidadService.getAll().subscribe((data: Especialidad[]) => {
      this.loading = false;
      this.listEspecialidad = data;
    }, (error) => {
      this.loading = false;
      this.errorServer = error.error?.error || 'Error al obtener lista de Especialidades';
      console.error(this.errorServer);
      this.router.navigate(['/profesional-add']);
      this.toastr.error(this.errorServer!, 'Error');

    })

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

  //Asigna las obras sociales del profesional a listObraSocialProfesional
  //  getObrasSociales(id : number){
  //       this.loading = true;
  //       this._usuarioService.getObrasSociales(id).subscribe((data : Usuario_obra_social[])=>{
  //                       data.forEach((item)=>{
  //                              this._obraSocialService.getOne(item.id_obra_social).subscribe((os : ObraSocial)=>{
  //                                            this.listObraSocialProfesional.push(os);      
  //                              }, (error)=>{
  //                                  this.loading = false;
  //                                  console.error(error);
  //                              })
  //                       })
  //                   this.loading = false;
  //                   console.log("Lista: ",this.listObraSocialProfesional);
                     
  //       }, (error)=>{
  //           this.loading = false;
  //           console.error(error);
  //       })
  // }

  async getObrasSociales(id: number): Promise<void> {
    this.loading = true;
    try {
      const data: Usuario_obra_social[] | undefined = await this._usuarioService.getObrasSociales(id).toPromise();
  
      if (data) {
        console.log("Data de obras sociales:", data);
  
        for (const item of data) {
          console.log("Item de obra social:", item);
  
          const os: ObraSocial | undefined = await this._obraSocialService.getOne(item.id_obra_social).toPromise();
  
          if (os) {
            this.listObraSocialProfesional.push(os);
          } else {
            console.error("El servicio de obra social no devolvió datos para el ID:", item.id_obra_social);
          }
        }
  
        console.log("Lista final: ", this.listObraSocialProfesional);
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

  addHorario(horario : Horario) : Observable<Horario>{
    
    return this._horarioService.create(horario);
      }



}
