import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export class SharedFunctions {


     //Recibe una fecha(Date) y devuelve la misma en formato string(YYYY-mm-dd)
     formatoFechaDB(fecha : Date) : string{
         
           const fechaDB : string = `${fecha.getFullYear()}-${(fecha.getMonth()+1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
          
           return fechaDB;
     }


     //Recibe como parametro una fecha(date) y devuelve la misma en formato string(dd/mm/yyyy)
     formatoFechaString(fecha : Date) : string{
           const fechaString : string = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth()+1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
           return fechaString;
     }

     //Recibe como parametro una fecha(NgbDate) y devuelve la misma en formato string(dd/mm/yyy)
     formatearFechaLocal(fecha: NgbDate): string {
        const fechaFormateada: string = `${fecha.day.toString().padStart(2, '0')}/${fecha.month.toString().padStart(2, '0')}/${fecha.year}`;

        return fechaFormateada;
    }

     //Recibme como parametro una fecha(NgbDate) y devuelve la misma en formatro string(yyyy-mm-dd)
    formatearFecha(fecha: NgbDate): string {
        const fechaFormateada: string = `${fecha.year}-${fecha.month.toString().padStart(2, '0')}-${fecha.day.toString().padStart(2, '0')}`;

        return fechaFormateada;
    }

     //Recibe como parametro una fecha (string) en formato yyyy-mm-dd yla devuelve en formato string dd/mm/yyyy
    formatFechaLocal(fecha: string): string {
        const elementos = fecha.split('-');
        const fechaLocal: string = `${elementos[2]}/${elementos[1]}/${elementos[0]}`;
  
        return fechaLocal;
     }


}