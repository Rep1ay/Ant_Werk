import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './location/navbar/navbar.component';
import { RegisterComponent } from './location/register/register.component';
import { LoginComponent } from './location/login/login.component';
import { HomeComponent } from './location/home/home.component';
import { PreloaderComponent } from './location/preloader/preloader.component';
import { ContactsComponent } from './location/contacts/contacts.component';
import { LocationComponent } from './location/location.component';
import { CareerComponent } from './location/career/career.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ContactsComponent,
    LocationComponent,
    PreloaderComponent,
    CareerComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule
    // NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
