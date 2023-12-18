import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListObrasocialComponent } from './components/list-obrasocial/list-obrasocial.component';
import { HomeComponent } from './components/home/home.component';
import { AddEditObrasocialComponent } from './components/add-edit-obrasocial/add-edit-obrasocial.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'obraSocial', component:  ListObrasocialComponent},
    {path: 'obraSocial-add', component: AddEditObrasocialComponent},
    {path: 'obraSocial-edit/:id', component: AddEditObrasocialComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
