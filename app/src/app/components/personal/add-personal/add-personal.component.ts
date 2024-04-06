import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-add-personal',
  templateUrl: './add-personal.component.html',
  styleUrls: ['./add-personal.component.css']
})
export class AddPersonalComponent implements OnInit {

  loading: boolean = false;
  form: FormGroup;

  constructor(private _usuarioService: UsuarioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(20)]],
      dni: ['', [Validators.required, Validators.maxLength(10)]],
      telefono: ['', Validators.maxLength(15)],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.maxLength(16)]],
      password_2: ['', [Validators.required, Validators.maxLength(16)]]
    });


  }
  ngOnInit(): void {

  }

  async create() {
    this.loading = true;

    //Valido passwords
    if (this.form.value.password !== this.form.value.password_2) {
      this.loading = false;
      this.router.navigate(['/personal-add'])
      this.toastr.error('Error las contraseñas deben coincidir', 'Error');
    } else {
      const personal: Usuario = {
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        dni: this.form.value.dni,
        telefono: this.form.value.telefono,
        email: this.form.value.email,
        password: this.form.value.password,
        rol: 2

      }
      try {
        await firstValueFrom(this._usuarioService.createPersonal(personal));
        this.router.navigate(['/personal']);
        this.toastr.success('Usuario creado exitosamente');
      } catch (error) {
        this.loading = false;
        console.error(error);

        this.router.navigate(['/personal-add']);

        this.toastr.error('Error al crear Personal', 'Error');
      }

    }

  }

}
