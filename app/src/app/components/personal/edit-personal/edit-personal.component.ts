import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/Usuario';

import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-edit-personal',
  templateUrl: './edit-personal.component.html',
  styleUrls: ['./edit-personal.component.css']
})
export class EditPersonalComponent implements OnInit {
                 loading : boolean = false;
                 errorServer : string | null = null;
                 form : FormGroup;
                 id : number;


     constructor(private _usuarioService : UsuarioService,
                 private toastr : ToastrService,
                 private fb : FormBuilder,
                 private router : Router,
                 private aRouter : ActivatedRoute
                  ){
                 this.form = this.fb.group({
                  nombre : ['', [Validators.required, Validators.maxLength(20)]],
                  apellido : ['', [Validators.required, Validators.maxLength(20)]],
                  dni: ['', [Validators.required, Validators.maxLength(10)]],
                  telefono: ['', Validators.maxLength(15)]
               
                 });
                 
                 this.id = Number(this.aRouter.snapshot.paramMap.get('id'));

     }
    ngOnInit(): void {
         this.getPersonal();
      
    }

    getPersonal(){
          this.loading = true;
          this._usuarioService.getOne(this.id).subscribe((data : Usuario) => {
                   this.loading  = false;
                    this.form.setValue({
                          nombre : data.nombre,
                          apellido : data.apellido,
                          dni : data.dni,
                          telefono : data.telefono,
                          
                    });
          }, (error) =>{
                     this.errorServer = error.error?.error || 'Error al obtener Usuario';
                     console.error(this.errorServer);
                     this.router.navigate(['/personal']);
                     this.toastr.error(this.errorServer!, 'Error');
          })
             
    }

    update(){
        this.loading = false;
        const personal : Usuario = {
             nombre : this.form.value.nombre,
             apellido : this.form.value.apellido,
             dni : this.form.value.dni,
             telefono : this.form.value.telefono
        }
        this._usuarioService.update(this.id, personal).subscribe(()=>{
                this.loading = false;
                this.router.navigate(['/personal']);
                this.toastr.success('Usuario modificado exitosamente', 'Personal');
        }, (error) =>{
                this.errorServer = error.error?.error || 'Error al modificar usuario';
                console.error(this.errorServer);
                this.toastr.error(this.errorServer!, 'Error');
        })

    }



}
