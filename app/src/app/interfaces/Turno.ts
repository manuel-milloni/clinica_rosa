import { Time } from "@angular/common";
import { Usuario } from "./Usuario";
import { Especialidad } from "./Especialidad";

export interface Turno {
       id? : number;
       fecha : Date | string;
       hora : Time | string;
       estado : string;
       observaciones : string;
       id_profesional : number;
       id_paciente : number;
       paciente? : Usuario;
       profesional? : Usuario
       especialidad? : Especialidad
       
}