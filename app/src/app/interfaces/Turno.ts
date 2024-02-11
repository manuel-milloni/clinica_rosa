import { Time } from "@angular/common";
import { Usuario } from "./Usuario";

export interface Turno {
       id? : number;
       fecha : Date | string;
       hora : Time | string;
       estado : string;
       observaciones : string;
       id_profesional : number;
       id_paciente : number;
       paciente? : Usuario;
       
}