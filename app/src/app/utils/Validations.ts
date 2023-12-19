import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class Validations {
     //Valida que al menos uno de los dias este seleccionado en los Horarios
    static validateCheckboxs() : ValidatorFn{
          return (control : AbstractControl) : ValidationErrors | null =>{
            const checkboxes = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
      
            const isChecked = checkboxes.some(checkbox => control.get(checkbox)?.value === true);
            // Si al menos uno está marcado, la validación es exitosa (devuelve null), de lo contrario, retorna un objeto de errores
            return isChecked ? null : { atLeastOneChecked: true };
          };
         
    }


}