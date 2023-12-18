import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-list-personal',
  templateUrl: './list-personal.component.html',
  styleUrls: ['./list-personal.component.css']
})
export class ListPersonalComponent implements OnInit {
               loading : boolean = false;
               listPersonal : Usuario[] = [];
               errorServer : string | null = null;

             
  
  constructor(private _usuarioService : UsuarioService,
              private toastr : ToastrService){

            }
           ngOnInit(): void {
                   this.getListPersonal();
            }

            getListPersonal(){
                 this.loading = true;
                 this._usuarioService.getAllPersonal().subscribe((data : Usuario[])=>{
                          this.listPersonal = data;
                          this.loading = false;
                 }, (error)=>{
                       this.loading = false;
                       this.errorServer = error.error?.error || 'Error al obtener lista del Personal';
                       console.error(this.errorServer);
                       this.toastr.error('Error al obtener lista del Personal', 'Error');
                 })
            }

             deletePersonal(id : number){
                     this.loading = true;
                     this._usuarioService.remove(id).subscribe(()=>{
                             this.getListPersonal();
                             this.toastr.success('Usuario eliminado exitosamente', 'Personal');
                     }, (error) => {
                           this.errorServer = error.error?.error || 'Error al eliminar Usuario';
                           console.error(this.errorServer);
                           this.getListPersonal();
                           this.toastr.error('Error al eliminar Usuario', 'Error');
                     })
             }

}
