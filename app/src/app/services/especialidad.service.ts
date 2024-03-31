import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Especialidad } from '../interfaces/Especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
        private myAppUrl : string;
        private myApiUrl : string;

  constructor(private http : HttpClient) { 
          this.myAppUrl = environment.endpoint;
          this.myApiUrl = 'api/especialidad';

  }

  getAll() : Observable<Especialidad[]>{
       return this.http.get<Especialidad[]>(this.myAppUrl + this.myApiUrl);
  }

  create(especialidad : Especialidad) : Observable<void>{
       return this.http.post<void>(this.myAppUrl + this.myApiUrl, especialidad);
  }

  remove(id : number) : Observable<void>{
       return this.http.delete<void>(this.myAppUrl + this.myApiUrl + '/' + id);
  }

  update(id : number, especilidad : Especialidad) : Observable<void>{
        return this.http.put<void>(this.myAppUrl + this.myApiUrl + '/' + id, especilidad);

  }

  getOne(id : number): Observable<Especialidad>{
       return this.http.get<Especialidad>(`${this.myAppUrl}${this.myApiUrl}/${id}`);

  }

  getEspecialidadByProfesional(idProfesional : number) : Observable<Especialidad>{
      return this.http.get<Especialidad>(`${this.myAppUrl}${this.myApiUrl}/byProfesional/${idProfesional}`);
  }
}
