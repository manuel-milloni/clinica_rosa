import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';

import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-edit-personal',
  templateUrl: './edit-personal.component.html',
  styleUrls: ['./edit-personal.component.css']
})
export class EditPersonalComponent implements OnInit {
                 loading : boolean = false;
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

    async getPersonal(){
          this.loading = true;
          try{
             const data : Usuario = await firstValueFrom(this._usuarioService.getOne(this.id));
             this.loading  = false;
             this.form.setValue({
                   nombre : data.nombre,
                   apellido : data.apellido,
                   dni : data.dni,
                   telefono : data.telefono,
                   
             });

          }catch(error){
            console.error(error);
            this.router.navigate(['/personal']);
            this.toastr.error('Error al obtener Personal', 'Error');
          }
     
             
    }

    async update(){
        this.loading = false;
        const personal : Usuario = {
             nombre : this.form.value.nombre,
             apellido : this.form.value.apellido,
             dni : this.form.value.dni,
             telefono : this.form.value.telefono
        }
        try{
            await firstValueFrom(this._usuarioService.update(this.id, personal));
            this.loading = false;
            this.router.navigate(['/personal']);
            this.toastr.success('Usuario modificado exitosamente', 'Personal');

        }catch(error){
            console.error(error);
            this.toastr.error('Error al modificar Personal', 'Error');
        }
    

    }



}
