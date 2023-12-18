import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-add-edit-especialidad',
  templateUrl: './add-edit-especialidad.component.html',
  styleUrls: ['./add-edit-especialidad.component.css']
})
export class AddEditEspecialidadComponent implements OnInit {
                  loading : boolean = false;   
                  operacion : string = 'Agregar ' ;
                  errorServer : string | null = null;
                  form : FormGroup;
                  id : number;
                  constructor(private fb : FormBuilder,
                             private _especialidadService : EspecialidadService,
                             private toastr : ToastrService,
                             private router : Router,
                             private aRouter : ActivatedRoute){
                       this.form = fb.group({
                              nombre : ['', [Validators.required, Validators.maxLength(20)]],
                              descripcion : ['', Validators.maxLength(255)]
                       });
                       this.id=Number(aRouter.snapshot.paramMap.get('id'));

                  }

     ngOnInit(): void {
            if(this.id !== 0 ){
                 this.operacion = 'Editar ';
                 this.getEspecialidad();

            }
     }

     getEspecialidad(){
          this.loading = true;
          this._especialidadService.getOne(this.id).subscribe((data : ObraSocial)=>{
                    this.loading = false;
                    this.form.setValue({
                         nombre : data.nombre,
                         descripcion : data.descripcion
                    })   
          }, (error) => {
               this.errorServer = error.error?.error || 'Error al obtener Especialidad es del o';
               console.error(this.errorServer);
               this.toastr.error('Error al obtener Especialdiad', 'Error');
               
          }
          )
     }

     
     addEditEspecialdiad(){
            this.loading = true;
            const especialidad : Especialidad = {
                 nombre : this.form.value.nombre,
                 descripcion : this.form.value.descripcion
            };
            if(this.id !==0){
                  //Editar
                   this._especialidadService.update(this.id, especialidad).subscribe(()=>{
                             this.loading = false;
                             this.router.navigate(['/especialidad']);
                             this.toastr.success('Especialidad modificada exitosamente', 'Especialidad');
                   }, (error) => {
                       this.errorServer = error.error?.error || 'Error al modificar Especialdiad';
                       console.error(this.errorServer);
                       this.router.navigate(['/especialidad']);
                       this.toastr.error('Error al modificar Especialdiad', 'Error');
                   })
            } else {
                 //Agregar
                 this._especialidadService.create(especialidad).subscribe(()=>{
                            this.loading = false;
                            this.router.navigate(['/especialidad']);
                            this.toastr.success('Especialidad agregada exitosamente', 'Especialidad');
                 }, (error) => {
                      this.loading = false;
                      this.errorServer = error.error?.error || 'Error al agregar Especialidad';
                      console.error(this.errorServer);
                      this.router.navigate(['/especialidad']);
                      this.toastr.error('Error al agregar Especialodad', 'Error');
                 })
            }

     }

}
