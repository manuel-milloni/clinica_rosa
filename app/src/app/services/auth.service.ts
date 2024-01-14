import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private myAppUrl : string;
  private myApiUrl : string;
       

  constructor(private http : HttpClient) { 
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = 'api/auth';
  }


    //Valida el token, devolviendo el payload
    verifyToken(token : string) : Observable<any>{
        const headers = new HttpHeaders().set('auth-token', token);
        return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}`, {headers});
         
    }
}
