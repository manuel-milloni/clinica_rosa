import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObraSocial } from '../interfaces/obraSocial';

@Injectable({
  providedIn: 'root'
})

export class ObrasocialService {
         private myAppUrl: string;
         private myApiUrl: string;


  constructor(private http: HttpClient) {
            this.myAppUrl = environment.endpoint;
            this.myApiUrl = 'api/obraSocial'
   }

   getAll(): Observable<ObraSocial[]>{
       return this.http.get<ObraSocial[]>(this.myAppUrl + this.myApiUrl);
   };

   remove(id: number): Observable<void>{
       return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
   } 

   create(obrasocial : ObraSocial): Observable<void>{
       return this.http.post<void>(this.myAppUrl + this.myApiUrl, obrasocial);
   }

   getOne(id : number): Observable<ObraSocial>{
      return this.http.get<ObraSocial>(`${this.myAppUrl}${this.myApiUrl}/${id}`);

   }

   update(id: number, obrasocial : ObraSocial): Observable<void>{
       return this.http.put<void>(this.myAppUrl + this.myApiUrl + "/" + id, obrasocial);
   }
}
