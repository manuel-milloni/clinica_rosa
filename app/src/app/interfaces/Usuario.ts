export interface Usuario {
        id? : number;
        nombre: string;
        apellido: string;
        dni : string;
        telefono? : string;
        email : string;
        password : string;
        matricula? : string;
        nroAfiliado? : string;
        rol : number;
        id_especialidad? : number;
        id_horario? : number;
        id_obra_social : number;
} 