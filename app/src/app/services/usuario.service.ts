import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/Usuario';
import { map } from 'rxjs/operators';
import { Usuario_obra_social } from '../interfaces/Usuario_obra_social';

@Injectable({
   providedIn: 'root'
})
export class UsuarioService {
   private myAppUrl: string;
   private myApiUrl: string;
   private myApiUrlPersonal: string;
   private myApiUrlProfesional: string;
   private myApiUrlPaciente: string;
   private myApiUrlLogin : string

   constructor(private http: HttpClient) {
      this.myAppUrl = environment.endpoint;
      this.myApiUrl = 'api/usuario';
      this.myApiUrlPersonal = 'api/personal';
      this.myApiUrlProfesional = 'api/profesional';
      this.myApiUrlPaciente = 'api/paciente';
      this.myApiUrlLogin = 'api/login';

   }

   getAllPersonal(): Observable<Usuario[]> {
      return this.http.get<Usuario[]>(this.myAppUrl + this.myApiUrlPersonal);

   }

   getAllProfesional() : Observable<Usuario[]>{
        return this.http.get<Usuario[]>(this.myAppUrl + this.myApiUrlProfesional);
   }

   getOne(id: number): Observable<Usuario> {
      return this.http.get<Usuario>(this.myAppUrl + this.myApiUrl + '/' + id);
   }

   remove(id: number): Observable<void> {
      return this.http.delete<void>(this.myAppUrl + this.myApiUrl + '/' + id);
   }

   createPersonal(usuario: Usuario): Observable<void> {
      return this.http.post<void>(this.myAppUrl + this.myApiUrlPersonal, usuario);
   }

   createPaciente(usuario: Usuario): Observable<void> {
      

      return this.http.post<void>(this.myAppUrl + this.myApiUrlPaciente, usuario)
    
   }

   createProfesional(usuario : Usuario) : Observable<Usuario>{
           return this.http.post<Usuario>(this.myAppUrl + this.myApiUrlProfesional, usuario)   
   }

   update(id: number, usuario: Usuario): Observable<void> {
      return this.http.put<void>(this.myAppUrl + this.myApiUrl + '/' + id, usuario);
   }

   login(usuario : Usuario) : Observable<string>{
             return this.http.post<string>(this.myAppUrl + this.myApiUrlLogin, usuario);
   }

   getObrasSociales(id : number) : Observable<Usuario_obra_social[]>{
        return this.http.get<Usuario_obra_social[]>(`${this.myAppUrl}${this.myApiUrlProfesional}/${id}`);
   }



}
