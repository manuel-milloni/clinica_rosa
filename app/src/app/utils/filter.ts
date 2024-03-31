import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name : 'filter'
})

export class FilterPipe implements PipeTransform{
   
        transform(items: any[], searchText: string) : any[]{
            if(!items || !searchText){
                return items;
            }

            searchText = searchText.toLowerCase();

            return items.filter(item =>{
                return(
                    item.nombre.toLowerCase().includes(searchText) ||
                    item.apellido.toLowerCase().includes(searchText) ||
                    item.email.toLowerCase().includes(searchText) ||
                    item.dni.toLowerCase().includes(searchText) 
                );
            });
        }
   
   



}