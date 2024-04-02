import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
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
       constructor(private _obrasocialService: ObrasocialService, private toastr: ToastrService){

       }

       ngOnInit(): void{
            this.getListObraSocial();
       }

       async getListObraSocial(){
          this.loading = true;
          try{
             const data : ObraSocial[] = await firstValueFrom(this._obrasocialService.getAll());
             this.listObraSocial = data;
             this.loading = false; 
          }catch(error){
               this.loading = false;
               console.log(error);
               this.toastr.error('Error al obtener listado de obras sociales', 'Error');  
          }
    
       }

       async deleteObraSocial(id : number){
          if(confirm('Desea eliminar este registro?')){
               this.loading = true;
               try{
                    await firstValueFrom(this._obrasocialService.remove(id));
                    this.getListObraSocial();
                    this.toastr.success('Obra Social eliminada exitosamente', 'Exito');

               }catch(error){
                    console.error(error);
                       this.getListObraSocial();
                       this.toastr.error('Error al eliminar Obra Social', 'Error');  
               }
          }
          }

}
