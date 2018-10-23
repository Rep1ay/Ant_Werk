import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { EnHomeComponent } from './en/home/home.component';
import { EnLoginComponent } from './en/login/login.component';
import { EnNavbarComponent } from './en/navbar/navbar.component';
import { EnRegisterComponent } from './en/register/register.component';

import { RuHomeComponent } from './ru/home/home.component';
import { RuLoginComponent } from './ru/login/login.component';
import { RuRegisterComponent } from './ru/register/register.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    EnHomeComponent,
    EnLoginComponent,
    EnRegisterComponent,
    EnNavbarComponent,
    RuHomeComponent,
    RuLoginComponent,
    RuRegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
