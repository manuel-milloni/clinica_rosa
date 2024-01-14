import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListObrasocialComponent } from './components/obrasocial/list-obrasocial/list-obrasocial.component';
import { HomeComponent } from './components/home/home.component';
import { AddEditObrasocialComponent } from './components/obrasocial/add-edit-obrasocial/add-edit-obrasocial.component';
import { ListEspecialidadComponent } from './components/especialidad/list-especialidad/list-especialidad.component';
import { AddEditEspecialidadComponent } from './components/especialidad/add-edit-especialidad/add-edit-especialidad.component';
import { ListPersonalComponent } from './components/personal/list-personal/list-personal.component';
import { AddPersonalComponent } from './components/personal/add-personal/add-personal.component';
import { HorarioService } from './services/horario.service';
import { ListHorarioComponent } from './components/horario/list-horario/list-horario.component';
import { AddHorarioComponent } from './components/horario/add-horario/add-horario.component';
import { EditHorarioComponent } from './components/horario/edit-horario/edit-horario.component';
import { EditPersonalComponent } from './components/personal/edit-personal/edit-personal.component';
import { SignInPacienteComponent } from './components/paciente/sign-in-paciente/sign-in-paciente.component';
import { LoginComponent } from './components/login/login.component';
import { AddProfesionalComponent } from './components/profesional/add-profesional/add-profesional.component';
import { ListProfesionalComponent } from './components/profesional/list-profesional/list-profesional.component';
import { EditProfesionalComponent } from './components/profesional/edit-profesional/edit-profesional.component';
import { RegistrarTurnoComponent } from './components/turno/registrar-turno/registrar-turno.component';
import { loginAuth, loginAuthAdmin } from './guards/login.auth';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'obraSocial', component:  ListObrasocialComponent, canActivate : [loginAuthAdmin]},
    {path: 'obraSocial-add', component: AddEditObrasocialComponent, canActivate : [loginAuthAdmin]},
    {path: 'obraSocial-edit/:id', component: AddEditObrasocialComponent, canActivate : [loginAuthAdmin]},

    {path: 'especialidad', component: ListEspecialidadComponent, canActivate : [loginAuthAdmin]},
    {path: 'especialidad-add', component: AddEditEspecialidadComponent, canActivate : [loginAuthAdmin]},
    {path: 'especialidad-edit/:id', component: AddEditEspecialidadComponent, canActivate : [loginAuthAdmin]},

    {path: 'personal', component: ListPersonalComponent, canActivate : [loginAuthAdmin]},
    {path: 'personal-add', component: AddPersonalComponent, canActivate : [loginAuthAdmin]},
    {path: 'personal-edit/:id', component: EditPersonalComponent, canActivate : [loginAuthAdmin]},

    {path: 'horario', component: ListHorarioComponent, canActivate : [loginAuthAdmin]},
    {path: 'horario-add', component: AddHorarioComponent, canActivate : [loginAuthAdmin]},
    {path: 'horario-edit/:id', component: EditHorarioComponent, canActivate : [loginAuthAdmin]},

    {path: 'profesional', component: ListProfesionalComponent, canActivate : [loginAuthAdmin]},
    {path: 'profesional-add', component: AddProfesionalComponent , canActivate : [loginAuthAdmin]},
    {path: 'profesional-edit/:id', component: EditProfesionalComponent, canActivate : [loginAuthAdmin]},

    {path: 'signIn', component: SignInPacienteComponent},
    {path : 'login', component : LoginComponent},

    {path: 'turno', component : RegistrarTurnoComponent, canActivate: [loginAuth]},

    {path: '**', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
