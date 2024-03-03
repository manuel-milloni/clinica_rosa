import { Horario } from "./Horario";
import { ObraSocial } from "./obraSocial";

export interface Usuario {
        id? : number;
        nombre?: string;
        apellido?: string;
        dni? : string;
        telefono? : string;
        email? : string;
        password? : string;
        matricula? : string;
        nroAfiliado? : string;
        rol? : number;
        id_especialidad? : number;
        especialidad? : string;
        id_horario? : number;
        horario? : Horario; 
        id_obra_social? : number;
        obras_sociales? : number[];
        obrasSociales? : ObraSocial[];
        genero? : string;
        fecha_nac? : string;

} 