import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
               loading  : boolean = false;
               form : FormGroup;
               errorServer : string | null = null;   
       
  
  constructor(private _usuarioService : UsuarioService,
              private toastr : ToastrService,
              private fb : FormBuilder,
              private router : Router){
               
              this.form = this.fb.group({
                   email : ['', [Validators.required]],
                   password : ['', Validators.required]
              })  

       }

       ngOnInit(): void {
         
       }

       login(){
          this.loading = true;
          const usuario : Usuario = {
                 email : this.form.value.email,
                 password : this.form.value.password
          }
          this._usuarioService.login(usuario).subscribe((data : string)=>{
                           this.loading = false;
                           const token = data;
                           
                           localStorage.setItem('auth-token', token);
                           this.router.navigate(['']);

                         

          }, (error) =>{
                   this.loading = false;
                   this.errorServer = error.error?.error || 'Error al iniciar sesion';
                   this.toastr.error('Usuario o password incorrectos', 'Error');
          })
       }

}
