import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Turno } from 'src/app/interfaces/Turno';
import { Usuario } from 'src/app/interfaces/Usuario';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
    selector: 'app-edit-modal',
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {
    form: FormGroup;
    turno: Turno | undefined;
    errrorServer: string | null = null;
    estados: string[] = ['Pendiente', 'Concretado', 'Ausente'];
    observacionValida: boolean = true;

    @Output() cerrarModal = new EventEmitter<void>();

    @Input() idTurno: number = 0;


    constructor(private fb: FormBuilder,
        private _turnoService: TurnoService,
        private toastr: ToastrService) {

        this.form = this.fb.group({
            estado: [],
            observaciones: [{ value: '', disabled: !this.observacionValida }]
        })

    }

    async ngOnInit(): Promise<void> {
        await this.getTurno();
        this.validaObservacion();


    }



    cerrar() {
        this.cerrarModal.emit();
    }

    async getTurno() {
        try {
            const turno: Turno = await firstValueFrom(this._turnoService.getOne(this.idTurno));



            const paciente: Usuario = await firstValueFrom(this._turnoService.getPaciente(this.idTurno));

            turno.paciente = paciente;

            this.turno = turno;

            this.form.patchValue({
                estado: turno.estado,
                observaciones: turno.observaciones
            });

        } catch (error: any) {
            this.errrorServer = error.error?.errr || 'Error al obtener turno';
            this.toastr.error(this.errrorServer!, 'Error');

        }

    }

    //Validar que para modificar la observacion la fecha-hora actual no exceda las 48hs de la fecha-hora del turno

    async update() {
        const body: any = {
            estado: this.form.value.estado,
            observaciones: this.form.value.observaciones
        };
        try {
            await firstValueFrom(this._turnoService.update(body, this.idTurno));
            this.cerrarModal.emit();
            this.toastr.success('Turno modificado exitosamente');

        } catch (error: any) {
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