import { Time } from "@angular/common";

export interface Turno {
       id? : number;
       fecha : Date | string;
       hora : Time | string;
       estado : string;
       observaciones : string;
       id_profesional : number;
       id_paciente : number;
       
}