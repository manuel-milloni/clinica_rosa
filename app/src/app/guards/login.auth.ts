import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

export const loginAuth = () => {
      const router = inject(Router);
      const toastr = inject(ToastrService);
      const _authService = inject(AuthService);

      const token = localStorage.getItem('auth-token');

      if(!token){
          router.navigate(['login']);
          toastr.error('Debe estar logueado para registrar un turno', 'Turno');
          return false;

      } else {

          return new Observable<boolean>((observer) => {
      _authService.verifyToken(token).subscribe(
        (data: any) => {
          //const result = data;
          //console.log(result);
          observer.next(true);
          observer.complete();
        },
        (error) => {
          console.error(error);
          observer.next(false);
          observer.complete();
        }
      );
    });
  }
};