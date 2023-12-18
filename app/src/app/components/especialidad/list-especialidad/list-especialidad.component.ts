import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
                errorServer : string | null = null;
  
            constructor(private _especialidadService : EspecialidadService, private toastr : ToastrService){

            } 
  
   ngOnInit(): void {
            this.getListEspecialidad();
      
    }

    getListEspecialidad(){
           this.loading = true;
           this._especialidadService.getAll().subscribe((data : Especialidad[])=> {
                    this.listEspecialidad = data;
                    this.loading = false;

           }, (error) => {
                this.errorServer = error.error?.error || 'Error al obtener lista de Especialidades';
                this.loading = false;
                this.toastr.error('Error al obtener lista de Especialidades', 'Error');
           }
           )
    }

    deleteEspecialidad(id: number){
          this.loading = true;
          this._especialidadService.remove(id).subscribe(()=>{
                      this.getListEspecialidad();
                      this.toastr.success('Especialidad eliminada exitosamente', 'Especialidad Agregada');
          }, (error) => {
                     this.errorServer = error.error?.error || 'Error al eliminar especialidad';
                     console.error(this.errorServer);
                     this.loading = false;
                     this.toastr.error('Error al eliminar Especialdiad', 'Error');
          })
    }



}
