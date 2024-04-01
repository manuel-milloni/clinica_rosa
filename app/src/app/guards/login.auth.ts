import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";
import { switchMap, catchError } from "rxjs/operators";
import { of } from 'rxjs';


export const loginAuth = () => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const _authService = inject(AuthService);

  const token = localStorage.getItem('auth-token');

  if (!token) {
      router.navigate(['login']);
      toastr.error('Debe estar logueado para continuar', 'Error');
      return of(false); // Devuelve un observable con valor false
  } else {
      return _authService.verifyToken(token).pipe(
          switchMap((data: any) => {
              if(data.rol === 0){
              return of(true);
              } else {
                toastr.error('Acceso denegado', 'Error');
                router.navigate(['login']); 
                return of(false);
              }
          }),
          catchError(error => {
              console.error(error);
              return of(false); // Devuelve un observable con valor false
          })
      );
  }
};

export const loginAuthProfesional = () => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const _authService = inject(AuthService);

  const token = localStorage.getItem('auth-token');

  if (!token) {
      router.navigate(['login']);
      toastr.error('Acceso denegado', 'Inicie sesion');
      return of(false);
  } else {
      return _authService.verifyToken(token).pipe(
          switchMap((data: any) => {
              if (data.rol === 1) {
                  return of(true);
              } else {
                  toastr.error('Acceso denegado', '');
                  return of(false);
              }
          }),
          catchError(error => {
              router.navigate(['login']);
              toastr.error('Acceso denegado', '');
              console.error(error);
              return of(false);
          })
      );
  }
};




export const loginAuthAdmin = () => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const _authService = inject(AuthService);

  const token = localStorage.getItem('auth-token');

  if (!token) {
      router.navigate(['login']);
      toastr.error('Acceso denegado', 'Inicie sesion');
      return of(false);
  } else {
      return _authService.verifyToken(token).pipe(
          switchMap((data: any) => {
              if (data.rol === 2) {
                  return of(true);
              } else {
                  toastr.error('Acceso denegado', '');
                  return of(false);
              }
          }),
          catchError(error => {
              router.navigate(['login']);
              toastr.error('Acceso denegado', '');
              console.error(error);
              return of(false);
          })
      );
  }
};

