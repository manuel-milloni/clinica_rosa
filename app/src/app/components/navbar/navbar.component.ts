import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
               login : boolean = false;
               payload : any;
               user : Usuario = {};

     constructor(private _authService : AuthService,
                 private _userService : UsuarioService,
                 private toastr : ToastrService){

                 }  
  
     async ngOnInit(): Promise<void> {
       await  this.verifyToken();
       await this.getUser();
    }


    logout(){
          localStorage.removeItem('auth-token');
       
    }


    async verifyToken(){
      const token = localStorage.getItem('auth-token');
      if(!token){
          
         return;
      }
      try{
         const data : any = await firstValueFrom(this._authService.verifyToken(token));
         this.payload = data;
         this.login = true;

      } catch(error){
          console.error(error);
      }

}

   async getUser(){
        const id = this.payload.id
        try
        {
          const data: Usuario | undefined = await firstValueFrom(this._userService.getOne(id));
            this.user = data!;
            

        } catch(error){
              console.error(error);
        }
     

   }









}
