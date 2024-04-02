import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';
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
                private toastr: ToastrService) {

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

}
