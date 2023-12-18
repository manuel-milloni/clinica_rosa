import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListObrasocialComponent } from './components/list-obrasocial/list-obrasocial.component';
import { HomeComponent } from './components/home/home.component';
import { AddEditObrasocialComponent } from './components/add-edit-obrasocial/add-edit-obrasocial.component';
import { ListEspecialidadComponent } from './components/especialidad/list-especialidad/list-especialidad.component';
import { AddEditEspecialidadComponent } from './components/especialidad/add-edit-especialidad/add-edit-especialidad.component';
import { ListPersonalComponent } from './components/personal/list-personal/list-personal.component';
import { AddPersonalComponent } from './components/personal/add-personal/add-personal.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'obraSocial', component:  ListObrasocialComponent},
    {path: 'obraSocial-add', component: AddEditObrasocialComponent},
    {path: 'obraSocial-edit/:id', component: AddEditObrasocialComponent},

    {path: 'especialidad', component: ListEspecialidadComponent},
    {path: 'especialidad-add', component: AddEditEspecialidadComponent},
    {path: 'especialidad-edit/:id', component: AddEditEspecialidadComponent},

    {path: 'personal', component: ListPersonalComponent},
    {path: 'personal-add', component: AddPersonalComponent},

    {path: '**', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
