import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
        selector: 'app-list-personal',
        templateUrl: './list-personal.component.html',
        styleUrls: ['./list-personal.component.css']
})
export class ListPersonalComponent implements OnInit {
        loading: boolean = false;
        listPersonal: Usuario[] = [];



        constructor(private _usuarioService: UsuarioService,
                        private toastr: ToastrService,
                        private _authService : AuthService,
                        private router : Router) {

        }
        ngOnInit(): void {
                this.getListPersonal();
        }

        async getListPersonal() {
                this.loading = true;
                try {
                        const data: Usuario[] = await firstValueFrom(this._usuarioService.getAllPersonal()); 
                        this.listPersonal = data;
                        this.loading = false;

                } catch (error) {
                        this.loading = false;
                        console.error(error);
                        this.toastr.error('Error al obtener lista del Personal', 'Error');
                }

        }

        async deletePersonal(id: number) {
                if (confirm('Desea eliminar este registro?')) {
                        this.loading = true;
                        try {
                                const payload = await this.verifyToken();
                                if(payload.id === id){
                                        this.loading = false;
                                        this.toastr.error('No es posible eliminar el usuario logueado');
                                        return;
                                }
                                await firstValueFrom(this._usuarioService.remove(id));
                                this.getListPersonal();
                                this.toastr.success('Usuario eliminado exitosamente', 'Personal');

                        } catch (error) {
                                console.error(error);
                                this.getListPersonal();
                                this.toastr.error('Error al eliminar Usuario', 'Error');
                        }

                }

        }

        async verifyToken(){
               this.loading = true;
               const token = localStorage.getItem('auth-token');
               if(!token){
                this.router.navigate(['login']);
                this.toastr.error('Inicie sesion para continuar', 'Error');
                return;
               }
               try{
                    const payload : any = await firstValueFrom(this._authService.verifyToken(token));
                    return payload;    
               }catch(error){
                 console.error(error);
                 this.router.navigate(['login']);
                 this.toastr.error('Inicie sesion para continuar', 'Error');

               } 
        }

}
