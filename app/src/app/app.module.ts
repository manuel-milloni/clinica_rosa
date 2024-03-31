import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddEditObrasocialComponent } from './components/obrasocial/add-edit-obrasocial/add-edit-obrasocial.component';
import { ListObrasocialComponent } from './components/obrasocial/list-obrasocial/list-obrasocial.component';
import { HomeComponent } from './components/home/home.component';
//Modules
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressBarComponent } from './shared/progress-bar/progress-bar.component';
import { ToastrModule } from 'ngx-toastr';
import { ListProfesionalComponent } from './components/profesional/list-profesional/list-profesional.component';
import { AddProfesionalComponent } from './components/profesional/add-profesional/add-profesional.component';
import { ListEspecialidadComponent } from './components/especialidad/list-especialidad/list-especialidad.component';
import { AddEditEspecialidadComponent } from './components/especialidad/add-edit-especialidad/add-edit-especialidad.component';
import { ListPersonalComponent } from './components/personal/list-personal/list-personal.component';
import { AddPersonalComponent } from './components/personal/add-personal/add-personal.component';
import { EditPersonalComponent } from './components/personal/edit-personal/edit-personal.component';
import { ListHorarioComponent } from './components/horario/list-horario/list-horario.component';
import { AddHorarioComponent } from './components/horario/add-horario/add-horario.component';
import { EditHorarioComponent } from './components/horario/edit-horario/edit-horario.component';
import { SignInPacienteComponent } from './components/paciente/sign-in-paciente/sign-in-paciente.component';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
import { EditProfesionalComponent } from './components/profesional/edit-profesional/edit-profesional.component';
import { RegistrarTurnoComponent } from './components/turno/registrar-turno/registrar-turno.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ProMisTurnosComponent } from './components/pro-mis-turnos/pro-mis-turnos.component';
import { EditModalComponent } from './components/pro-mis-turnos/edit-modal/edit-modal.component';
import { MisTurnosPacienteComponent } from './components/paciente/mis-turnos-paciente/mis-turnos-paciente.component';
import { MiperfilPacienteComponent } from './components/paciente/miperfil-paciente/miperfil-paciente.component';
import { InformesComponent } from './components/informes/informes.component';
import { ProInformesComponent } from './components/pro-mis-turnos/pro-informes/pro-informes.component';
import { SharedFunctions } from './utils/SharedFunctions';
import { TurnosComponent } from './components/admin/turnos/turnos.component';
import { PacientesComponent } from './components/admin/pacientes/pacientes.component';


import { AddPacienteComponent } from './components/admin/pacientes/add-paciente/add-paciente/add-paciente.component';
import { AddTurnoComponent } from './components/admin/pacientes/add-turno/add-turno/add-turno.component';
import { FilterPipe } from './utils/filter';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AddEditObrasocialComponent,
    ListObrasocialComponent,
    HomeComponent,
    ProgressBarComponent,
    ListProfesionalComponent,
    AddProfesionalComponent,
    ListEspecialidadComponent,
    AddEditEspecialidadComponent,
    ListPersonalComponent,
    AddPersonalComponent,
    EditPersonalComponent,
    ListHorarioComponent,
    AddHorarioComponent,
    EditHorarioComponent,
    SignInPacienteComponent,
    LoginComponent,
    ModalComponent,
    EditProfesionalComponent,
    RegistrarTurnoComponent,
    ProMisTurnosComponent,
    EditModalComponent,
    MisTurnosPacienteComponent,
    MiperfilPacienteComponent,
    InformesComponent,
    ProInformesComponent,
    TurnosComponent,
    PacientesComponent,
    AddPacienteComponent,
   
    AddTurnoComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
    }),
    NgbModule,
    FormsModule
  ],
  providers: [SharedFunctions],
  bootstrap: [AppComponent]
})
export class AppModule { }
