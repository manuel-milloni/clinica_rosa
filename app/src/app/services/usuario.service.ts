import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
          this.myAppUrl = environment.endpoint;
          this.myApiUrl = 'api/profesional';

   }

  
}
