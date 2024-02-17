import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Turno} from '../interfaces/Turno';
import { Usuario } from '../interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private myAppUrl : string;
  private myApiUrl : string;


  constructor(private http : HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/turno';
   }

   getByProfesionalAndFecha(idProfesional : number, fecha : string) : Observable<Turno[]>{
        const body = {fecha : fecha };
        return this.http.post<Turno[]>(`${this.myAppUrl}${this.myApiUrl}/${idProfesional}`, body);
   }

   create(turno : Turno): Observable<void>{
       return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, turno);
   }

   getPaciente(idTurno : number) : Observable<Usuario>{
      return this.http.get<Usuario>(`${this.myAppUrl}${this.myApiUrl}/paciente/${idTurno}`);
   }

   getTurnosByFechaAndProfesional(fechas : any, idProfesional : number) : Observable<Turno[]>{
             return this.http.post<Turno[]>(`${this.myAppUrl}${this.myApiUrl}/profesional/${idProfesional}`, fechas);
   }

   update(body : any, idTurno : number) : Observable<void>{
       return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/${idTurno}`, body);
   }

   getOne(idTurno : number) : Observable<Turno>{
        return this.http.get<Turno>(`${this.myAppUrl}${this.myApiUrl}/${idTurno}`);
   }


}
