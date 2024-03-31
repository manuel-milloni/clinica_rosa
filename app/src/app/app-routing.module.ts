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
import { loginAuth, loginAuthAdmin, loginAuthProfesional } from './guards/login.auth';
import { ProMisTurnosComponent } from './components/pro-mis-turnos/pro-mis-turnos.component';
import { MisTurnosPacienteComponent } from './components/paciente/mis-turnos-paciente/mis-turnos-paciente.component';
import { MiperfilPacienteComponent } from './components/paciente/miperfil-paciente/miperfil-paciente.component';
import { InformesComponent } from './components/informes/informes.component';
import { ProInformesComponent } from './components/pro-mis-turnos/pro-informes/pro-informes.component';
import { TurnosComponent } from './components/admin/turnos/turnos.component';
import { PacientesComponent } from './components/admin/pacientes/pacientes.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    //----------Admin -------------------------------------------------------
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

    {path: 'informes', component: InformesComponent, canActivate: [loginAuthAdmin]},
    {path: 'turnos', component: TurnosComponent, canActivate: [loginAuthAdmin]},
    {path: 'pacientes', component: PacientesComponent, canActivate: [loginAuthAdmin]},
    {path: 'pacientes/edit-paciente/:id', component: MiperfilPacienteComponent, canActivate: [loginAuthAdmin]},
    {path: 'pacientes/add-paciente', component: SignInPacienteComponent, canActivate: [loginAuthAdmin]},
    {path: 'pacientes/add-turno/:id', component: RegistrarTurnoComponent, canActivate: [loginAuthAdmin]},


    //------------Profesional-------------------------------------//
    {path : 'profesional/mis-turnos', component : ProMisTurnosComponent, canActivate : [loginAuthProfesional] },
    {path: 'profesional/informes', component : ProInformesComponent, canActivate : [loginAuthProfesional]},
   


    //--------------PACIENTE-------------------------//
    {path: 'signIn', component: SignInPacienteComponent},
    {path: 'turno', component : RegistrarTurnoComponent, canActivate: [loginAuth]},
    {path: 'mis-turnos', component : MisTurnosPacienteComponent, canActivate: [loginAuth] },
    {path: 'mi-perfil', component : MiperfilPacienteComponent, canActivate: [loginAuth]},

    {path : 'login', component : LoginComponent},

    {path: '**', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
