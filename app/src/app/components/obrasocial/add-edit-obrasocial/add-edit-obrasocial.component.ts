import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { ObrasocialService } from 'src/app/services/obrasocial.service';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
       selector: 'app-add-edit-obrasocial',
       templateUrl: './add-edit-obrasocial.component.html',
       styleUrls: ['./add-edit-obrasocial.component.css']
})
export class AddEditObrasocialComponent implements OnInit {
       form: FormGroup;
       loading: boolean = false;
       id: number;
       operacion: string = 'Agregar ';


       constructor(private fb: FormBuilder,
              private _obrasocialService: ObrasocialService,
              private toastr: ToastrService,
              private router: Router,
              private aRouter: ActivatedRoute) {
              this.form = this.fb.group({
                     nombre: ['', [Validators.required, Validators.maxLength(20)]],
                     descripcion: ['', Validators.maxLength(255)]
              });
              this.id = Number(aRouter.snapshot.paramMap.get('id'));
       }


       ngOnInit(): void {
              if (this.id !== 0) {
                     this.operacion = 'Editar ';
                     this.getObrasocial(this.id);
              }
       }

       async getObrasocial(id: number) {
              this.loading = true;
              try {
                     const data: ObraSocial = await firstValueFrom(this._obrasocialService.getOne(id));
                     this.loading = false;
                     this.form.setValue({
                            nombre: data.nombre,
                            descripcion: data.descripcion
                     })

              } catch (error) {
                     console.error(error);
                     this.toastr.error('Error al obtener obra social', 'Error');
              }

       }

       async addObraSocial() {
              this.loading = true;
              const obraSocial: ObraSocial = {
                     nombre: this.form.value.nombre,
                     descripcion: this.form.value.descripcion
              };
              if (this.id !== 0) {
                     //Editar
                     try {
                           await firstValueFrom(this._obrasocialService.update(this.id, obraSocial));
                           this.loading = false;
                           this.router.navigate(['/obraSocial']);
                           this.toastr.success('Obra Social modificada exitosamente');
                     } catch (error) {
                            console.error(error);
                            this.router.navigate(['/obraSocial']);
                            this.toastr.error('Error al modificar Obra Social', 'Error');
                     }
               


              } else {
                     //Agregar
                     try{
                        await firstValueFrom(this._obrasocialService.create(obraSocial));
                        this.loading = false;
                        this.router.navigate(['/obraSocial']);
                        this.toastr.success('Obra Social agregada exitosamente', 'Obra Social');   

                     }catch(error){
                            this.loading = false;
                            console.error(error);
                            this.router.navigate(['/obraSocial']);
                            this.toastr.error('Error al agregar Obra Social', 'Error'); 
                     }
               

              }




       }

}
