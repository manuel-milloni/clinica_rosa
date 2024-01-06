import { Time } from "@angular/common";

export interface Turno {
       id? : number;
       fecha : Date;
       hora : Time;
       estado : string;
       observaciones : string;
       id_profesional : number;
       id_paciente : number;
       
}