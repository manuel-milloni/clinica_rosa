import { Component, OnInit } from '@angular/core';
import {Horario} from '../../../interfaces/Horario';
import { HorarioService } from 'src/app/services/horario.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-list-horario',
  templateUrl: './list-horario.component.html',
  styleUrls: ['./list-horario.component.css']
})
export class ListHorarioComponent implements OnInit {
         loading : boolean =  false;
         listHorario : Horario[] = [];
       
  
  constructor(private _horarioService : HorarioService,
              private toastr : ToastrService,
              ){

     }  
  
  ngOnInit(): void {
             this.loading = true;
             this.getListHorario();
    }

     async getListHorario(){
           this.loading = true;
           try{
              const data : Horario[] = await firstValueFrom(this._horarioService.getAll());
              this.listHorario = data;      
                  this.loading = false;

           }catch(error){
            this.loading = false;
            console.error(error);
            this.toastr.error('Error al obtener listado de Horarios');   
           }
         
     }

   async deleteHorario(id : number){
      if(confirm('Desea eliminar este registro?')){
            this.loading = true;
            try{
                  await firstValueFrom(this._horarioService.remove(id));
                  this.loading = false;
                  this.getListHorario();
                  this.toastr.success('Horario eliminado exitosamente', 'Horario');

            }catch(error){
                  this.loading = false;
                  console.error(error);
                  this.toastr.error('Error al eliminar registro', 'Error');
            }
    
      }
   
     }

}
