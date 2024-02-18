import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { AuthService } from 'src/app/services/auth.service';
import { ObrasocialService } from 'src/app/services/obrasocial.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Validations } from 'src/app/utils/Validations';

@Component({
  selector: 'app-miperfil-paciente',
  templateUrl: './miperfil-paciente.component.html',
  styleUrls: ['./miperfil-paciente.component.css']
})
export class MiperfilPacienteComponent implements OnInit {
  loading: boolean = false;
  errorServer: string | null = null;
  form: FormGroup
  listObraSocial: ObraSocial[] = [];
  paciente : Usuario | undefined;



  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private _authService: AuthService,
    private _userService: UsuarioService,
    private router: Router,
    private _obraSocialService : ObrasocialService,
    private _turnoService : TurnoService) {

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(20)]],
      dni: ['', [Validators.required, Validators.maxLength(10)]],
      telefono: ['', Validators.maxLength(15)],

      password: ['', [ Validators.maxLength(16)]],
      // password: ['', [Validators.required, Validators.maxLength(16)]],
      // password_2: ['', [Validators.required, Validators.maxLength(16)]],
      password_2: ['', [ Validators.maxLength(16)]],
      obraSocial: ['', Validators.required],
      nroAfiliado: ['', Validators.maxLength(20)]
    }, { validator: Validations.matchPasswords('password', 'password_2') });

     //Funcion que se ejecuta cuando se detecta cambios en el formulario en el campo Obra social
     this.form.get('obraSocial')?.valueChanges.subscribe((selectedObraSocialId) => {
      console.log('Ejecutando');
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

  }
 async ngOnInit(): Promise<void> {
      await this.getPaciente();
      await this.getListObraSocial();
  }

  async getPaciente() {
    const token = localStorage.getItem('auth-token');

    if (!token) {
      this.router.navigate(['login']);
      this.toastr.error('Error al validar usuario', 'Error');
      return;
    }
    try {
      const payload : any = await firstValueFrom(this._authService.verifyToken(token));

      const paciente : Usuario = await firstValueFrom(this._userService.getOne(payload.id));
      
    


      this.form.patchValue({
          nombre : paciente.nombre,
          apellido : paciente.apellido,
          dni : paciente.dni,
          telefono : paciente.telefono,
          obraSocial : paciente.id_obra_social,
          nroAfiliado : paciente.nroAfiliado
      })

      this.paciente = paciente;




    } catch (error) {
      this.router.navigate(['login']);
      this.toastr.error('Error al validar usuario', 'Error');


    }

  }

  async getListObraSocial(){
    this.loading = true;
    try{
        const data : ObraSocial[] = await firstValueFrom(this._obraSocialService.getAll());

        this.listObraSocial = data;
        this.loading = false;
    }catch(error){
      this.loading = false;
       this.toastr.error('Error al obtener obras sociales', 'Error');
    }
   
  }

  async update() {
    let body: Partial<Usuario> = {};

    //Si se modifico obra social debo validar que no tenga turnos con estado pendiente
    if(this.paciente?.id_obra_social !== this.form.value.obraSocial){
        try{
          const turnos = await firstValueFrom(this._turnoService.getTurnosPaciente(this.paciente?.id!));

          if(turnos.length > 0){
             //No puede modificar obra social
            
             this.toastr.error('No puede modificar la Obra Social teniendo turnos pendientes', 'Error');
             return;
          } else {
            body = {
              ...body,
              id_obra_social: this.form.value.obraSocial
            };
          } 



        }catch(error){
           this.toastr.error('Error al modificar datos', 'Error');
        }
    }

    if(this.form.value.password === ''){

      const usuario : Partial<Usuario> = {
        nombre : this.form.value.nombre,
        apellido : this.form.value.apellido,
        dni : this.form.value.dni,
        telefono : this.form.value.telefono,
        nroAfiliado : this.form.value.nroAfiliado
     };

     body = {
       ...body,
       ...usuario
     };
    } else {
        //Modifica pass
        body = {
          ...body,
          password : this.form.value.password
        };
    } 
  

    try{

       await firstValueFrom(this._userService.update(this.paciente?.id!, body));

       this.toastr.success('Datos modificados exitosamente!');
    }catch(error){
       this.toastr.error('Error al actualizar datos', 'Error');
    }
    console.log('Continuo con el hilo de la funcion');

  
}

  //Funcion para deshabilitar el input del html de Nro de afiliado cuando se selecciona Obra social Particular
  isNroAfiliadoDisabled(): boolean {
    const obraSocialControl = this.form.get('obraSocial');
    return obraSocialControl?.value === '1' || false; // Deshabilitar si la obra social es 'Particular' (id='1')
  }





}
