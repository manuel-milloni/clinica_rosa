import { Component, OnInit } from '@angular/core';
import {Horario} from '../../../interfaces/Horario';
import { HorarioService } from 'src/app/services/horario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-horario',
  templateUrl: './list-horario.component.html',
  styleUrls: ['./list-horario.component.css']
})
export class ListHorarioComponent implements OnInit {
         loading : boolean =  false;
         listHorario : Horario[] = [];
         errorServer : string | null = null;   
  
  constructor(private _horarioService : HorarioService,
              private toastr : ToastrService,
              ){

     }  
  
  ngOnInit(): void {
             this.loading = true;
             this.getListHorario();
    }

     getListHorario(){
           this.loading = true;
           this._horarioService.getAll().subscribe((data : Horario[])=>{
                  this.listHorario = data;      
                  this.loading = false;


            } , (error) =>{
                 this.loading = false;
                 this.errorServer = error.error?.error || 'Error al obtener listado de Horarios';
                 console.error(this.errorServer);
                 this.toastr.error('Error al obtener listado de Horarios'); 
           })
     }

     deleteHorario(id : number){
               this.loading = true;
               this._horarioService.remove(id).subscribe(()=>{
                         this.loading = false;
                         this.getListHorario();
                         this.toastr.success('Horario eliminado exitosamente', 'Horario');
               }, (error) =>{
                     this.loading = false;
                     this.errorServer = error.error?.error || 'Error al eliminar Horario';
                     console.error(this.errorServer);
                     this.toastr.error(this.errorServer!, 'Error');
               })
     }

}
