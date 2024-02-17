import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Turno } from 'src/app/interfaces/Turno';
import { Usuario } from 'src/app/interfaces/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mis-turnos-paciente',
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrls: ['./mis-turnos-paciente.component.css']
})
export class MisTurnosPacienteComponent implements OnInit {
               listTurnos : Turno[] = [];
               errorServer : string | null = null;
               paciente : Usuario | undefined;
               idPaciente : number = 0;
               turno : Turno | undefined;
     constructor(private _turnoService : TurnoService,
                 private toastr : ToastrService,
                 private _userService : UsuarioService,
                 private _authService : AuthService,
                 private router : Router){

     }

     async ngOnInit(): Promise<void> {
           await this.getPaciente();
           await this.getTurnos();
     }

     async getPaciente(){
          const token = localStorage.getItem('auth-token');
          if(!token){
             
              this.toastr.error('Error al validar usuario', 'Error');
              this.router.navigate(['login']);
              return;

          }

              try{
                  const payload : any = await firstValueFrom(this._authService.verifyToken(token!));

                  this.idPaciente = payload.id;

                  const paciente : Usuario = await firstValueFrom(this._userService.getOne(this.idPaciente));

                  this.paciente = paciente;
              }catch(error : any){
                  this.errorServer = error.error?.error || 'Error al validar usuario';
                  this.router.navigate(['login'])
                  this.toastr.error(this.errorServer!, 'Error');

              }
    
     }

     async getTurnos(){
          
          try{
             const data : Turno[] = await firstValueFrom(this._turnoService.getTurnosPaciente(this.idPaciente));
             this.listTurnos = data;

             await this.setProfesionalTurnos();
          } catch(error : any){
              this.errorServer = error.error?.error || 'Error al obtener turnos del paciente';
              this.toastr.error(this.errorServer!, 'Error');
          } 
        
     }

    async  setProfesionalTurnos(){
      try{

      
          this.listTurnos.forEach(async (turno)=>{
             const profesional : Usuario = await firstValueFrom(this._userService.getOne(turno.id_profesional));

             turno.profesional = profesional;
          })
        

      }catch(error : any){
          this.errorServer = error.error?.error || 'Error server';
          this.toastr.error(this.errorServer!, 'Error');
      }
       

     }

    async cancelarTurno(idTurno : number){
         const turno : Turno = this.listTurnos.find((turno)=> idTurno === turno.id  )!;

         const fechaTurnoDate   = new Date (`${turno.fecha}T${turno.hora}`);

         if(this.valida48hs(fechaTurnoDate)){
                try{
                     await firstValueFrom(this._turnoService.delete(turno.id!));
                     this.getTurnos();
                     this.toastr.success('Turno cancelado exitosamente!');
                }catch(error : any){
                    this.errorServer = error.error?.error || 'Error al cancelar turno';
                    this.toastr.error(this.errorServer!, 'Error');
                }
         } else {
            this.toastr.error('No es posible cancelar el turno, comuniquese con la Clinica', 'Error');

         }



     }

     valida48hs(fechaTurno : Date) : boolean{
         
         const fechaActual = new Date();
          
         const difMilisegundos = fechaTurno.getTime() - fechaActual.getTime();

         const difHoras = Math.abs(difMilisegundos / (1000 * 60 * 60));

         return difHoras > 48;

     }

}
