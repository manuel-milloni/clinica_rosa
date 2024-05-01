import { Time } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Horario } from 'src/app/interfaces/Horario';
import { Turno } from 'src/app/interfaces/Turno';
import { Usuario } from 'src/app/interfaces/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import { HorarioService } from 'src/app/services/horario.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SharedFunctions } from 'src/app/utils/SharedFunctions';

@Component({
    selector: 'app-edit-modal',
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {
    form: FormGroup;
    turno: Turno | undefined;
    errrorServer: string | null = null;
    estados: string[] = ['Pendiente', 'Concretado', 'Ausente', 'Cancelado'];

    observacionValida: boolean = true;
    estadoValido: boolean = true;

    payload: any;
    admin: boolean = true;
    loading : boolean = false;


 

    @Output() cerrarModal = new EventEmitter<void>();

    @Input() idTurno: number = 0;


    constructor(private fb: FormBuilder,
        private _turnoService: TurnoService,
        private toastr: ToastrService,
        private sharedFunctions: SharedFunctions,
        private _authService: AuthService,
        private router: Router,
        private _userService: UsuarioService,
        private _horarioService: HorarioService) {

        this.form = this.fb.group({
            estado: [],
            observaciones: [{ value: '', disabled: !this.observacionValida }]
        })

    }

    async ngOnInit(): Promise<void> {
        await this.verifyToken();
        await this.getTurno();

        //Si el usuario logueado es Admin no se realiza las validaciones por ende puede modifcar cualquier turno
        if (this.payload.rol != 2) {
            this.admin = false;
            this.estados = ['Pendiente', 'Concretado', 'Ausente'];
            this.validaObservacion();
            this.validaEstado();

            // Establecer el valor del select después de que el estadoValido se haya establecido correctamente
            if (!this.estadoValido) {
                this.form.get('estado')?.disable();
                console.log('El estado deberia aparecer deshabilitado');
            } else {
                console.log('El estado deberia estar habilitado');
            }

            console.log('Estado: ', this.estadoValido);

        }


    }

    async verifyToken() {
        this.loading = true;
        const token = localStorage.getItem('auth-token');
        if (!token) {
            this.loading = false;
            this.router.navigate(['login']);
            this.toastr.error('Inicie sesion para continuar', 'Error');
            return;
        }
        try {
            const pay = await firstValueFrom(this._authService.verifyToken(token));
            this.payload = pay;
            this.loading = false;
        } catch (error) {
            this.loading = false;
            this.router.navigate(['login']);
            console.error(error);
            this.toastr.error('Inicie sesion para continuar', 'Error');
        }
    }



    cerrar() {
        this.cerrarModal.emit();
    }

    async getTurno() {
        this.loading = true;
        try {
            const turno: Turno = await firstValueFrom(this._turnoService.getOne(this.idTurno));

            if (typeof turno.fecha === 'string') {
                const fecha = this.sharedFunctions.formatFechaLocal(turno.fecha);
                turno.fechaLocal = fecha;
            }

            const paciente: Usuario = await firstValueFrom(this._turnoService.getPaciente(this.idTurno));

            const profesional: Usuario = await firstValueFrom(this._userService.getOne(turno.id_profesional!));


            turno.paciente = paciente;
            turno.profesional = profesional;

            this.turno = turno;

            this.form.patchValue({
                estado: turno.estado,
                observaciones: turno.observaciones
            });
            this.loading = false;

        } catch (error: any) {
            this.loading = false;
            this.errrorServer = error.error?.errr || 'Error al obtener turno';
            this.toastr.error(this.errrorServer!, 'Error');

        }

    }


    //Permite modificar estado del turno cuando:
    //-El estado del mismo es distinto de Concretado o Cancelado y cuando la fecha actual es posterior o igual a la fecha del turno

    validaEstado() {
        const fechaActual = new Date();
        const fechaTurno = new Date(this.turno!.fecha);
        if (this.turno?.estado === 'Concretado' || this.turno?.estado === 'Cancelado') {
            console.log('Estoy en un concretado');
            this.estadoValido = false;
        } else {
            this.estadoValido = fechaActual.getTime() >= fechaTurno.getTime();

        }


    }

    //Validar que para modificar la observacion la fecha-hora actual no exceda las 48hs de la fecha-hora del turno

    async update() {
        this.loading = true;
        const body: any = {
            estado: this.form.value.estado,
            observaciones: this.form.value.observaciones
        };
        try {
            await firstValueFrom(this._turnoService.update(body, this.idTurno));
            this.cerrarModal.emit();
            this.loading = false;
            this.toastr.success('Turno modificado exitosamente');

        } catch (error: any) {
            this.loading = false;
            this.errrorServer = error.error?.error || 'Error al modificar turno';
            this.cerrarModal.emit();
            this.toastr.error(this.errrorServer!, 'Error');

        }


    }

    validaObservacion() {
        const fechaActual = new Date();
        const fechaTurno = new Date(`${this.turno!.fecha}T${this.turno!.hora}`);

        const difMilisegundos = fechaActual.getTime() - fechaTurno.getTime();

        const difHoras = Math.abs(difMilisegundos / (1000 * 60 * 60));

        if (difHoras > 48) {
            this.observacionValida = false;
        }

    }

   



}
