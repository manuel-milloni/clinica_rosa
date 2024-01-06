import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Turno} from '../interfaces/Turno';

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


}
