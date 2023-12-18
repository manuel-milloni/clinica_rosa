import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private myAppUrl: string;
  private myApiUrl :string;
  private myApiUrlPersonal: string;
  private myApiUrlProfesional : string;
  private myApiUrlPaciente : string;

  constructor(private http: HttpClient) {
          this.myAppUrl = environment.endpoint;
          this.myApiUrl = 'api/usuario';
          this.myApiUrlPersonal = 'api/personal';
          this.myApiUrlProfesional = 'api/profesional';
          this.myApiUrlPaciente = 'api/paciente';

   }

   getAllPersonal() : Observable<Usuario[]>{
       return this.http.get<Usuario[]>(this.myAppUrl + this.myApiUrlPersonal);

   }

   getOne(id: number) : Observable<Usuario>{
      return this.http.get<Usuario>(this.myAppUrl + this.myApiUrl + '/' + id);
   }

   remove(id: number) : Observable<void>{
      return this.http.delete<void>(this.myAppUrl + this.myApiUrl + '/' + id);
   }

   createPersonal(usuario : Usuario) : Observable<void>{
      return this.http.post<void>(this.myAppUrl + this.myApiUrlPersonal, usuario);
   }

   update(id: number ,  usuario : Usuario) : Observable<void>{
      return this.http.put<void>(this.myAppUrl + this.myApiUrl + '/' + id, usuario);
   }
   

  
}
