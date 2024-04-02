import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Especialidad } from 'src/app/interfaces/Especialidad';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-list-especialidad',
  templateUrl: './list-especialidad.component.html',
  styleUrls: ['./list-especialidad.component.css']
})
export class ListEspecialidadComponent implements OnInit {
                listEspecialidad : Especialidad[] = [];
                loading : boolean = false;
             
  
            constructor(private _especialidadService : EspecialidadService, private toastr : ToastrService){

            } 
  
   ngOnInit(): void {
            this.getListEspecialidad();
      
    }

    async getListEspecialidad(){
           this.loading = true;
            try{
               const data : Especialidad[] =  await firstValueFrom(this._especialidadService.getAll());
               this.listEspecialidad = data;
               this.loading = false;
            }catch(error){
             
              this.loading = false;
              this.toastr.error('Error al obtener Especialidades', 'Error');

            }
    
    }

    async deleteEspecialidad(id: number){
        if(confirm('Desea eliminar este registro?')){
          this.loading = true;

          try{
            await firstValueFrom(this._especialidadService.remove(id));
            this.getListEspecialidad();
            this.toastr.success('Especialidad eliminada exitosamente');
          }catch(error){
            console.error(error);
            this.loading = false;
            this.toastr.error('Error al eliminar Especialdiad', 'Error'); 
          }
  
    }

}
}
