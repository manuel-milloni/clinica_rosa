import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name : 'filter'
})

export class FilterPipe implements PipeTransform{

        transform(items: any[], searchText: string, propertiesToSearch: string[]): any[] {
            if (!items || !searchText) {
                return items;
            }
    
            searchText = searchText.toLowerCase();
    
            return items.filter(item => {
                // Verifica si existe alguna de las propiedades a buscar en el objeto
                const hasMatch = propertiesToSearch.some(property => {
                    // Verifica si la propiedad existe en el objeto y si su valor incluye el texto de búsqueda
                    const nestedProperties = property.split('.');
                    let value = item;
                    for (const prop of nestedProperties) {
                        if (value.hasOwnProperty(prop)) {
                            value = value[prop];
                        } else {
                            return false; // Si alguna propiedad anidada no existe, se devuelve false
                        }
                    }
                    return value.toLowerCase().includes(searchText);
                });
    
                return hasMatch;
            });
        }






   
   



}