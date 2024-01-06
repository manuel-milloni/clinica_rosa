import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormArray, FormControl} from "@angular/forms";
import { ObraSocial } from "../interfaces/obraSocial";

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

static matchPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get(passwordKey)?.value;
        const confirmPassword = control.get(confirmPasswordKey)?.value;

        const match = password === confirmPassword;

        return match ? null : { passwordsNotMatch: true, passwordMismatch: true };
    };
}



//Valida que al menos una Obra Social este seleccionada al agregar un profesional
static atLeastOneObraSocialSelected(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
          const selectedObraSociales = control.controls.filter(ctrl => ctrl.enabled);

          return selectedObraSociales.length > 0 ? null : { atLeastOneObraSocial: true };
      }
      return null;
  };
}

static atLeastOneObraSocialSelectedEdit(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {

      // Verifica si hay al menos un elemento en el FormArray
      const hasAtLeastOne = control.length > 0;

      return hasAtLeastOne ? null : { atLeastOneObraSocial: true };
    }
    return null;
  };
}

static osSeleccionadaEnFormulario(listObrasocialProfesional: ObraSocial[], obraSocialId: number): boolean {
  const obrasSocialesArray = listObrasocialProfesional.map(os => os.id);
  return obrasSocialesArray.includes(obraSocialId);
}
  
  
  
  
  




  


}