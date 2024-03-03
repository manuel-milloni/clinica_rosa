import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { ObrasocialService } from 'src/app/services/obrasocial.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Validations } from 'src/app/utils/Validations';

@Component({
  selector: 'app-sign-in-paciente',
  templateUrl: './sign-in-paciente.component.html',
  styleUrls: ['./sign-in-paciente.component.css']
})
export class SignInPacienteComponent implements OnInit {
  loading: boolean = false;
  errorServer: string | null = null;
  form: FormGroup
  listObraSocial: ObraSocial[] = [];
  genero: string = ''; // Variable para almacenar el género seleccionado
  mostrarCalendario : boolean = false;
  fechaNac : NgbDate | undefined;
  fechaNacInput : string | undefined;

  constructor(private _usuarioService: UsuarioService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private _obraSocialService: ObrasocialService) {

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(20)]],
      dni: ['', [Validators.required, Validators.maxLength(10)]],
      telefono: ['', Validators.maxLength(15)],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.maxLength(16)]],
      password_2: ['', [Validators.required, Validators.maxLength(16)]],
      obraSocial: ['', Validators.required],
      nroAfiliado: ['', Validators.maxLength(20)],
      genero: ['', Validators.required],
      fecha_nac: ['', Validators.required]
    }, { validator: Validations.matchPasswords('password', 'password_2') });

    //Funcion que se ejecuta cuando se detecta cambios en el formulario en el campo Obra social
    this.form.get('obraSocial')?.valueChanges.subscribe((selectedObraSocialId) => {

      if (selectedObraSocialId === '1') {

        // Deshabilitar el control nroAfiliado y quitar la validación de requerido
        this.form.get('nroAfiliado')?.clearValidators();
        this.form.get('nroAfiliado')?.reset(); // Resetear el valor si es necesario
        this.form.get('nroAfiliado')?.disable();
      } else {
        // Habilitar el control nroAfiliado y agregar la validación de requerido
        this.form.get('nroAfiliado')?.enable();
        this.form.get('nroAfiliado')?.setValidators([Validators.required, Validators.maxLength(20)]);
      }

      // Actualizar las validaciones
      this.form.get('nroAfiliado')?.updateValueAndValidity();
    });

    // Suscripción a los cambios en el campo 'genero'
    this.form.get('genero')?.valueChanges.subscribe(() => {
      console.log('Modificando genero');
      console.log('genero: ', this.form.value.genero);
 
    });


  }


  ngOnInit(): void {
    this.getListObraSocial();

  }

  async create() {

    this.loading = true;
    const paciente: Usuario = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      dni: this.form.value.dni,
      telefono: this.form.value.telefono,
      email: this.form.value.email,
      password: this.form.value.password,
      id_obra_social: this.form.value.obraSocial,
      nroAfiliado: this.form.value.nroAfiliado,
      genero : this.form.value.genero,
      fecha_nac : this.form.value.fecha_nac
    };

    try{
       await firstValueFrom(this._usuarioService.createPaciente(paciente));
       this.loading = false;
       this.router.navigate(['']);
       this.toastr.success('Usuario creado exitosamente', 'Registro');
    }catch(error : any){
      this.loading = false;
      this.errorServer = error.error?.error || 'Error al crear usuario';
      console.error(this.errorServer);
      this.router.navigate(['/signIn']);
      this.toastr.error(this.errorServer!, 'Error');
    }

  }


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

  //Funcion para deshabilitar el input del html de Nro de afiliado cuando se selecciona Obra social Particular
  isNroAfiliadoDisabled(): boolean {
    const obraSocialControl = this.form.get('obraSocial');
    return obraSocialControl?.value === '1' || false; // Deshabilitar si la obra social es 'Particular' (id='1')
  }

  //Genero------------------

  // Método para verificar si el género está seleccionado
isGeneroSelected(genero: string): boolean {
  return this.form.get('genero')?.value === genero;
}


  toggleGenero(genero: string): void {
    if (this.isGeneroSelected(genero)) {
      this.form.controls['genero'].setValue(null); // Si el género está seleccionado, deseleccionar
    } else {
      this.form.controls['genero'].setValue(genero); // Si el género no está seleccionado, seleccionar
    }
  }

  //-----Fecha nac-------------------------------------------------

  toogleCalendario(){
     this.mostrarCalendario = !this.mostrarCalendario;
  }

  seleccionarFecha(event: { year: number; month: number; day: number }) {
    const fechaSeleccionada: NgbDate = new NgbDate(event.year, event.month, event.day);

    console.log('Fecha seleccionada: ', fechaSeleccionada);

    this.fechaNacInput = this.formatearFecha(fechaSeleccionada);
    
    const fechaForm =  this.formatearFechaDB(fechaSeleccionada);
    this.form.patchValue({
        fecha_nac : fechaForm 
    });

 

}

formatearFecha(fecha : NgbDate) : string{
       
       const fechaFormateada : string = `${fecha.day.toString().padStart(2, '0')}/${fecha.month.toString().padStart(2,'0')}/${fecha.year}`;
       return fechaFormateada;
}

formatearFechaDB(fecha : NgbDate) : string{
      const fechaFormateada : string = `${fecha.year}-${fecha.month.toString().padStart(2, '0')}-${fecha.day.toString().padStart(2,'0')}`;
      return fechaFormateada;
}
  

 







}
