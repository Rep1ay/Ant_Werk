import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { EnModuleModule } from './en/en-module.module';
import { RuModuleModule } from './ru/ru-module.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
// import { PreloaderComponent } from './en/preloader/preloader.component';
// import { ContactsComponent } from './en/contacts/contacts.component';


@NgModule({
  declarations: [
    AppComponent,
    // EnHomeComponent,
    // EnLoginComponent,
    // EnRegisterComponent,
    NavbarComponent,
    // PreloaderComponent,
    // RuHomeComponent,
    // RuLoginComponent,
    // RuRegisterComponent,
    // ContactsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    EnModuleModule,
    RuModuleModule
    // NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
