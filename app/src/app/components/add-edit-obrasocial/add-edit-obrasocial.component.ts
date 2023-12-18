import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, Form} from '@angular/forms';
import { ObrasocialService } from 'src/app/services/obrasocial.service';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-edit-obrasocial',
  templateUrl: './add-edit-obrasocial.component.html',
  styleUrls: ['./add-edit-obrasocial.component.css']
})
export class AddEditObrasocialComponent implements OnInit {
           form: FormGroup;
           loading : boolean = false;
           errorServer : string | null = null;
           id: number;
           operacion : string = 'Agregar ';


                 constructor(private fb: FormBuilder, 
                             private _obrasocialService : ObrasocialService, 
                             private toastr : ToastrService, 
                             private router : Router,
                             private aRouter: ActivatedRoute){
                         this.form = this.fb.group({
                               nombre : ['', [Validators.required, Validators.maxLength(20)]],
                               descripcion : ['', Validators.maxLength(255)]
                         });
                         this.id= Number(aRouter.snapshot.paramMap.get('id'));
                 }
              
   
             ngOnInit(): void {
                      if(this.id !== 0){
                            this.operacion = 'Editar ';
                            this.getObrasocial(this.id);
                      }
             }

             getObrasocial(id: number){
                      this.loading = true;
                      this._obrasocialService.getOne(id).subscribe((data: ObraSocial) =>{
                              this.loading = false;
                              this.form.setValue({
                                     nombre: data.nombre,
                                     descripcion : data.descripcion
                              })
                      }, (error) =>{
                             this.errorServer = error.error?.error || "Error al obtenter Obra Social",
                             this.toastr.error('Error al obtener obra social', 'Error');
                      })
             }

             addObraSocial(){
                   this.loading = true;
                   const obraSocial : ObraSocial = {
                        nombre: this.form.value.nombre,
                        descripcion : this.form.value.descripcion
                   };
                    if(this.id !==0){
                         //Editar
                          this._obrasocialService.update(this.id, obraSocial).subscribe(()=>{
                                 this.loading = false;
                                 this.router.navigate(['/obraSocial']);
                                 this.toastr.success('Obra Social modificada exitosamente', 'Modificar Obra social'); 
                          }, (error)=>{
                                 this.errorServer = error.error?.error || 'Error al modificar Obra social';
                                 console.error(this.errorServer);
                                 this.router.navigate(['/obraSocial']);
                                 this.toastr.error('Error al modificar Obra Social', 'Error');
                          }
                          
                          )
                         
                          
                    } else {
                          //Agregar
                        this._obrasocialService.create(obraSocial).subscribe(()=> {
                              this.loading = false;
                              this.router.navigate(['/obraSocial']);
                              this.toastr.success('Obra Social agregada exitosamente', 'Obra Social');
                     }, (error) =>{
                            this.loading = false;
                             this.errorServer = error.error?.error || "Error al agregar Obra social";
                            console.error(this.errorServer);
                            this.router.navigate(['/obraSocial']);
                            this.toastr.error('Error al agregar Obra Social', 'Error');
  
                     })

                    }

                  
                  
                 
             }

}
