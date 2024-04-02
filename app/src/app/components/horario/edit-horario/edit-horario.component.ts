import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Horario } from 'src/app/interfaces/Horario';
import { HorarioService } from 'src/app/services/horario.service';
import { Validations } from 'src/app/utils/Validations';
import { Time } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/Usuario';


@Component({
  selector: 'app-edit-horario',
  templateUrl: './edit-horario.component.html',
  styleUrls: ['./edit-horario.component.css']
})
export class EditHorarioComponent implements OnInit {
                 loading : boolean = false;
               
                 form : FormGroup;
                 listHoras : string[] = [];
           listHorasDesde : string[] = [];
           listHorasHasta : string[] = [];
                id : number;
                 
      constructor(private _horarioService : HorarioService,
                  private fb : FormBuilder,
                  private router : Router,
                  private toastr : ToastrService,
                  private aRouter : ActivatedRoute){
                    this.form = this.fb.group({
                      horaDesde : ['', Validators.required],
                      horaHasta : ['', Validators.required],
                      lunes : [false],
                      martes : [false],
                      miercoles : [false],
                      jueves : [false],
                      viernes : [false]
                }, {validator : Validations.validateCheckboxs()}); //Se ejecuta ante un cambio en el formulario
                this.id = Number(this.aRouter.snapshot.paramMap.get('id'));

      } 
  
  ngOnInit(): void {
    this.generateListHoras();
    this.generateListHorasDesde();
    this.form.get('horaDesde')?.valueChanges.subscribe((horaDesde : string) =>{
          this.updateHorasHasta(horaDesde);
    });

         this.getHorario();
        
         console.log("Formulario del inicio editar: ",this.form);
   }

   async getHorario(){
        this.loading = true;
        try{
          const data : Horario = await firstValueFrom(this._horarioService.getOne(this.id));
          this.loading = false;
                    
          this.form.setValue({
            horaDesde : this.formatTime(data.horaDesde),
            horaHasta : this.formatTime(data.horaHasta),
            lunes : data.lunes,
            martes : data.martes,
            miercoles : data.miercoles,
            jueves : data.jueves,
            viernes: data.viernes
          })

        }catch(error){
          this.loading = false;
          console.error(error);
          this.router.navigate(['/horario']);
          this.toastr.error('Error al obtener Horario', 'Error');
        }

   }

   // Agregar este método para formatear la hora
   private formatTime(time: Time): string {
    const timeString = time.toString(); // Convierte el objeto Time a una cadena
    return timeString.substring(0, 5); // Obtener solo las primeras 5 caracteres (HH:mm)
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

   async update(){
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
    try{

      //Valido que no existan profesionales con el Horario asignado
      const profesionales : Usuario[] = await firstValueFrom(this._horarioService.getProfesionalesByHorario(this.id));
      if(profesionales.length != 0){
        this.loading = false;
        this.router.navigate(['/horario']);
         this.toastr.error('No es posible modificar un Horario asignado a un Profesional', 'Error');
         return;
      };

      await firstValueFrom(this._horarioService.update(this.id, horario));
      this.loading = false;
      this.router.navigate(['/horario']);
      this.toastr.success('Horario modificado exitosamente', 'Horario');

    }catch(error){
      this.loading = false;
      console.error(error);
      this.toastr.error('Error al modificar Horario','Error');
    }
  
   }
}
