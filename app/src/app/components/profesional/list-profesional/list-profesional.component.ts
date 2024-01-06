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


@Component({
  selector: 'app-list-profesional',
  templateUrl: './list-profesional.component.html',
  styleUrls: ['./list-profesional.component.css']
})
export class ListProfesionalComponent  implements OnInit{
               loading : boolean = false;
               errorServer : string | null = null;
               listProfesionales : Usuario[] = [];
               listEspecialidades : Especialidad[] = [];
               listHorarios : Horario[] = [];
               horario : Horario | undefined;
               obras_sociales : number[] = [];
               listObrasSocialesProfesional : ObraSocial[] = [];
        
              

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

               getListEspecialidades(){
                   this.loading = true;
                   this._especialidadService.getAll().subscribe((data : Especialidad[])=>{
                                this.loading = false;
                                this.listEspecialidades = data;
                   }, (error)=>{
                                 this.loading = false;
                                 this.errorServer = error.error?.error || 'Error al obtener Especialidades';
                                 console.error(this.errorServer);
                                 this.toastr.error(this.errorServer!, 'Error');
                   })
               }

               getListHorarios(){
                this.loading = true;
                this._horarioService.getAll().subscribe((data : Horario[])=>{
                             this.loading = false;
                             this.listHorarios = data;
                            
                }, (error)=>{
                              this.loading = false;
                              this.errorServer = error.error?.error || 'Error al obtener Horarios';
                              console.error(this.errorServer);
                              this.toastr.error(this.errorServer!, 'Error');
                })
            }

               getListProfesionales(){
                   this.loading = true;
                   this._usuarioService.getAllProfesional().subscribe((data : Usuario[])=>{
                           this.loading = false;
                           this.listProfesionales = data;
                           this.updateEspecialidad();
                         
                           this.updateHorario();
                           this.updateObraSocial();
                   }, (error)=>{
                         this.loading = false;
                         this.errorServer = error.error?.error || 'Error al obtener lista de Profesionales';
                         console.error(this.errorServer);
                         this.toastr.error(this.errorServer!, 'Error');
                   })
                  
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

              updateObraSocial(){
                  this.loading = true;
                  
                  this.listProfesionales.forEach((profesional)=>{
                      
                         this._usuarioService.getObrasSociales(profesional.id!).subscribe((data : Usuario_obra_social[])=>{
                                  profesional.obrasSociales = profesional.obrasSociales || [];
                                  data.forEach((item)=> { this._obraSocialService.getOne(item.id_obra_social).subscribe((os : ObraSocial)=>{
                                                
                                                 profesional.obrasSociales?.push(os);
                                            
                                                 this.loading = false;
                                  }, (error)=>{
                                         this.loading = false;    
                                         console.error(error);
                                  })});
                                  

                         }, (error)=>{
                                this.loading  = false;
                                console.error(error);
                         })
                  })
              }

     

               deleteProfesional(id : number){
                   this.loading = true;
                   this._usuarioService.remove(id).subscribe(()=>{
                        this.loading = false;
                        this.toastr.success('Usuario eliminado exitosamente', 'Usuario');                        
 
                   }, (error)=>{
                       this.loading = false;
                       this.errorServer = error.error?.error || 'Error al eliminar usuario';
                       console.error(this.errorServer);
                       this.toastr.error(this.errorServer!, 'Error'); 
                      
                   })

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
