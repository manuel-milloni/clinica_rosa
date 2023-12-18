import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddEditObrasocialComponent } from './components/add-edit-obrasocial/add-edit-obrasocial.component';
import { ListObrasocialComponent } from './components/list-obrasocial/list-obrasocial.component';
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
    EditPersonalComponent
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
