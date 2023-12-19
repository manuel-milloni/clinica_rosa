import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Horario } from 'src/app/interfaces/Horario';
import { HorarioService } from 'src/app/services/horario.service';
import { Validations } from 'src/app/utils/Validations';

@Component({
  selector: 'app-add-horario',
  templateUrl: './add-horario.component.html',
  styleUrls: ['./add-horario.component.css']
})
export class AddHorarioComponent implements OnInit {
           loading : boolean = false;
           errorServer : string | null = null;
           form : FormGroup
           listHoras : string[] = [];
           listHorasDesde : string[] = [];
           listHorasHasta : string[] = [];
          

            constructor(private _horarioService : HorarioService,
                        private toastr : ToastrService,
                        private fb : FormBuilder,
                        private router : Router
                        ){
                  this.form = this.fb.group({
                        horaDesde : ['', Validators.required],
                        horaHasta : ['', Validators.required],
                        lunes : [false],
                        martes : [false],
                        miercoles : [false],
                        jueves : [false],
                        viernes : [false]
                  }, {validator : Validations.validateCheckboxs()}); //Se ejecuta ante un cambio en el formulario
        
            }
    ngOnInit(): void {
          this.generateListHoras();
          this.generateListHorasDesde();
          this.form.get('horaDesde')?.valueChanges.subscribe((horaDesde : string) =>{
                this.updateHorasHasta(horaDesde);
          });

   }

    generateListHoras(){
      for (let hora = 9; hora <= 18; hora++) {
            const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
            this.listHoras.push(`${horaFormateada}:00`);
          }
    }

    generateListHorasDesde(){
         this.listHorasDesde = this.listHoras.filter(hora => hora !== '18:00'); 
    }

    updateHorasHasta(horaDesde : string){
          const horaDesdeSelect = this.listHoras.indexOf(horaDesde);

          this.listHorasHasta = this.listHoras.slice(horaDesdeSelect + 1);
    }


    create(){
        this.loading = true;
        const horario : Horario = {
              horaDesde : this.form.value.horaDesde,
              horaHasta : this.form.value.horaHasta,
              lunes : this.form.value.lunes,
              martes : this.form.value.martes,
              miercoles : this.form.value.miercoles,
              jueves : this.form.value.jueves,
              viernes: this.form.value.viernes
        }
        this._horarioService.create(horario).subscribe(()=>{
                   this.loading = false;
                   this.router.navigate(['/horario']);
                   this.toastr.success('Horario agregado exitosamente', 'Horario');
        }, (error) =>{
               this.loading = false;
               this.errorServer = error.error?.error || 'Error al agregar Horario';
               console.error(this.errorServer);
               this.router.navigate(['/horario-add'])
               this.toastr.error(this.errorServer!, 'Error');
        })
    }

}
