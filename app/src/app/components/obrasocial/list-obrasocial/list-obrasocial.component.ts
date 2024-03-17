import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ObraSocial } from 'src/app/interfaces/obraSocial';
import { ObrasocialService } from 'src/app/services/obrasocial.service';

@Component({
  selector: 'app-list-obrasocial',
  templateUrl: './list-obrasocial.component.html',
  styleUrls: ['./list-obrasocial.component.css']
})
export class ListObrasocialComponent implements OnInit {
       listObraSocial: ObraSocial[]=[];
       loading : boolean = false;
       errorServer: string | null = null;
       constructor(private _obrasocialService: ObrasocialService, private toastr: ToastrService){

       }

       ngOnInit(): void{
            this.getListObraSocial();
       }

       getListObraSocial(){
          this.loading = true;
            this._obrasocialService.getAll().subscribe((data: ObraSocial[]) =>{
                 this.listObraSocial = data;
                 this.loading = false; 
                 
            }, (error) => {
                  this.loading = false;
                  this.errorServer =  error.error?.error || "Error al traer obras sociales.";
                  this.toastr.error('Error al obtener listado de obras sociales', 'Error');
            })
       }

       deleteObraSocial(id : number){
          if(confirm('Desea eliminar este registro?')){
               this.loading = true;
               this._obrasocialService.remove(id).subscribe( ()=> {
                       this.getListObraSocial();
                       this.toastr.success('Obra Social eliminada exitosamente', 'Exito');
               }, (error) => {
                    
                    this.errorServer = error.error?.error || 'Error al eliminar la obra social';
                    console.error(this.errorServer);
                       this.getListObraSocial();
                       this.toastr.error('Error al eliminar Obra Sociial', 'Error');
               }
               )

          }

         
       
       
          }

}
