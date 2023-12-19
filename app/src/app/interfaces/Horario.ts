import { Time } from "@angular/common";

export interface Horario {
     id? : number;
     horaDesde : Time;
     horaHasta : Time;
     lunes : boolean;
     martes : boolean;
     miercoles : boolean;
     jueves : boolean;
     viernes : boolean;

}