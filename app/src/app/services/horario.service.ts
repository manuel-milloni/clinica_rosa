import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Horario } from '../interfaces/Horario';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
            private myAppUrl : string;
            private myApiUrl : string;
  constructor(private http : HttpClient) { 
       this.myAppUrl = environment.endpoint;
       this.myApiUrl = 'api/horario';
  }

  getAll() : Observable<Horario[]>{
      return this.http.get<Horario[]>(this.myAppUrl + this.myApiUrl);
      
  }

  create(horario : Horario) : Observable<void>{
     return this.http.post<void>(this.myAppUrl + this.myApiUrl, horario);
  }

  remove(id : number) : Observable<void>{
      return this.http.delete<void>(this.myAppUrl + this.myApiUrl + '/' + id);
  }

  update(id :number, horario : Horario) : Observable<void>{
      return this.http.put<void>(this.myAppUrl + this.myApiUrl + '/' + id, horario);
  }

  getOne(id : number): Observable<Horario>{ 
        return this.http.get<Horario>(this.myAppUrl + this.myApiUrl + '/' + id);
  }
}
