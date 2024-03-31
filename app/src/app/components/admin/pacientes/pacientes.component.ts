import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit{
         listPacientes : Usuario[] = [];
         loading : boolean = false;

         searchText : string = '';

      constructor(private  _userService : UsuarioService,
                  private toastr : ToastrService){

      }

      async ngOnInit(): Promise<void> {
          await this.getPacientes();
      }

     async getPacientes(){
       this.loading = true;
      try{
         const pacientes = await firstValueFrom(this._userService.getPacientes());

         this.listPacientes = pacientes;
         this.loading = false;
      }catch(error){
        this.loading = false;
          console.error(error);
          this.toastr.error('Error al obtener pacientes', 'Error');
      }
     }

     deletePersonal(id : number){

     }

     generarTurno(id : number){

     }
}
