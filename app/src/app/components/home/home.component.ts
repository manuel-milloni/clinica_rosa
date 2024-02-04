import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
              loading : boolean = false;
              payload : any;
              homeAdmin : boolean = false;
              homeProfesional : boolean = false;
            
       
      constructor(private _authService : AuthService){

       }
  
     ngOnInit(): void {
         this.verifyToken();
    }

    verifyToken(){
          this.loading = true;
          const token = localStorage.getItem('auth-token');
          if(!token){
             this.loading = false;
             return;
          }
          this._authService.verifyToken(token!).subscribe((data : any)=>
          {
               this.loading = false;
              const payload = data
              
              
               if(payload.rol === 2){
                    this.homeAdmin = true;
                    return;
               }

               if(payload.rol === 1){
                      this.homeProfesional = true;
                      return;
               }

              

               

          }, (error)=>{
               this.loading = false;
              console.error('Error: ', error);
             
             

          })

    }




}
