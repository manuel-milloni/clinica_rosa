import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { Usuario} from 'src/app/interfaces/Usuario';
import { Horario } from 'src/app/interfaces/Horario';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HorarioService } from 'src/app/services/horario.service';



//Modal
import { Modal } from 'bootstrap';
import { Usuario_obra_social } from 'src/app/interfaces/Usuario_obra_social';
import { ObrasocialService } from 'src/app/services/obrasocial.service';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-list-profesional',
  templateUrl: './list-profesional.component.html',
  styleUrls: ['./list-profesional.component.css']
})
export class ListProfesionalComponent  implements OnInit{
               loading : boolean = false;
               listProfesionales : Usuario[] = [];
               listEspecialidades : Especialidad[] = [];
               listHorarios : Horario[] = [];
               horario : Horario | undefined;
               obras_sociales : number[] = [];
               listObrasSocialesProfesional : ObraSocial[] = [];
               searchText : string = '';
        
              

               constructor(private _usuarioService : UsuarioService,
                          private toastr : ToastrService,
                          private router : Router,
                          private _especialidadService : EspecialidadService,
                          private _horarioService : HorarioService,
                          private _obraSocialService : ObrasocialService){

               }

               ngOnInit(): void {
                   this.getListEspecialidades();
                   this.getListHorarios();
                   this.getListProfesionales();
                  
                   
                  
                 
               }

               async getListEspecialidades(){
                   this.loading = true;
                   try{
                      const data : Especialidad[] = await firstValueFrom(this._especialidadService.getAll());
                      this.loading = false;
                      this.listEspecialidades = data;
                   }catch(error){
                    this.loading = false;
                    console.error(error);
                    this.toastr.error('Error al obtener Especialidades', 'Error');
                   }
             
               }

               async getListHorarios(){
                this.loading = true;
                try{
                   const data : Horario[] = await firstValueFrom(this._horarioService.getAll());
                   this.loading = false;
                   this.listHorarios = data;
                }catch(error){
                  this.loading = false;
                  console.error(error);
                  this.toastr.error('Error al obtener Horarios', 'Error');
                }
         
            }

               async getListProfesionales(){
                   this.loading = true;
                   try{
                      const data : Usuario[] = await firstValueFrom(this._usuarioService.getAllProfesional());
                      this.loading = false;
                      this.listProfesionales = data;
                      this.updateEspecialidad();
                    
                      this.updateHorario();
                      await this.updateObraSocial();

                   }catch(error){
                    this.loading = false;
                    console.error(error);
                    this.toastr.error('Error al obtener Profesionales', 'Error');
                   }
              
                  
               }

            

               updateEspecialidad() {
                this.loading = true;
            
              
                this.listProfesionales.forEach((profesional) => {
                  let especialidadFind: Especialidad | undefined = this.listEspecialidades.find((espe) => espe.id === profesional.id_especialidad);
              
                  if (especialidadFind) {
                    
                    profesional.especialidad = especialidadFind.nombre;
                  } else {
                    console.error(`No se encontró la especialidad para el profesional con ID ${profesional.id}`);
                  }
                });
              
                this.loading = false;
              }

              updateHorario() {
                this.loading = true;
            
                 
                this.listProfesionales.forEach((profesional) => {
                  
                  let horarioFind: Horario | undefined = this.listHorarios.find((horario) =>  horario.id === profesional.id_horario);
                   
                  
                  if (horarioFind) {
                    
                    profesional.horario = horarioFind;
                  } else {
                    console.error(`No se encontró el horario para el profesional con ID ${profesional.id}`);
                  }
                });
              
                this.loading = false;
              }

              async updateObraSocial(){
                  this.loading = true;
                  try{
                    this.listProfesionales.forEach(async (profesional)=>{
                        const data : Usuario_obra_social[] = await firstValueFrom(this._usuarioService.getObrasSociales(profesional.id!));
                        profesional.obrasSociales = profesional.obrasSociales || [];
                        data.forEach(async (item)=>{
                            const os : ObraSocial = await firstValueFrom(this._obraSocialService.getOne(item.id_obra_social));
                            profesional.obrasSociales?.push(os);
                            this.loading = false;
                        })

                    })
                  }catch(error){
                    this.loading = false;    
                    console.error(error);
                  }
                  
                  // this.listProfesionales.forEach((profesional)=>{
                      
                  //        this._usuarioService.getObrasSociales(profesional.id!).subscribe((data : Usuario_obra_social[])=>{
                  //                 profesional.obrasSociales = profesional.obrasSociales || [];
                  //                 data.forEach((item)=> { this._obraSocialService.getOne(item.id_obra_social).subscribe((os : ObraSocial)=>{
                                                
                  //                                profesional.obrasSociales?.push(os);
                                            
                  //                                this.loading = false;
                  //                 }, (error)=>{
                  //                        this.loading = false;    
                  //                        console.error(error);
                  //                 })});
                                  

                  //        }, (error)=>{
                  //               this.loading  = false;
                  //               console.error(error);
                  //        })
                  // })
              }

     

               async deleteProfesional(id : number){
                if(confirm('Desea eliminar este registro?')){
                  this.loading = true;
                  try{
                     await firstValueFrom(this._usuarioService.remove(id));
                     this.loading = false;
                     this.getListProfesionales();
                     this.toastr.success('Usuario eliminado exitosamente', 'Usuario'); 

                  }catch(error){
                    this.loading = false;
                    console.error(error);
                    this.toastr.error('Error al eliminar Profesional', 'Error'); 
                  }
          
                }
         

               }

               getHorario(id : number): Horario | undefined{
                  const pro : Usuario | undefined = this.listProfesionales.find((profesional)=> profesional.id === id); 
                  return pro?.horario;
                  
               }

               modalHorario(id: number): void {
                // Obtén el horario correspondiente
                this.horario = this.getHorario(id);
              
                // Mostrar el modal
                const modalElement: any = document.getElementById('staticBackdrop');
                if (modalElement) {
                  // Inicializa el modal usando el método 'Modal' de Bootstrap
                  const modal = new Modal(modalElement);
                  modal.show();
                }
              }

              getObrasSociales(id : number) : ObraSocial[] | undefined {
                     const profesional : Usuario | undefined = this.listProfesionales.find((profesional)=>profesional.id === id);
                     return profesional?.obrasSociales;
              }

              modalObraSocial(id: number): void {
                // Obtén el horario correspondiente
                this.listObrasSocialesProfesional = this.getObrasSociales(id)!;
              
                // Mostrar el modal
                const modalElement: any = document.getElementById('staticBackdropOS');
                if (modalElement) {
                  // Inicializa el modal usando el método 'Modal' de Bootstrap
                  const modal = new Modal(modalElement);
                  modal.show();
                }
              }
              


          
              
              


}
