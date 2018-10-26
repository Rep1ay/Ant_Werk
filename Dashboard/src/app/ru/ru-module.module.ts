import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuHomeComponent } from './home/home.component';
import { RuLoginComponent } from './login/login.component';
import { RuRegisterComponent } from './register/register.component';
import { RuContactsComponent } from './contacts/contacts.component';
import { FormsModule } from '@angular/forms';
import { PreloaderComponent } from './preloader/preloader.component'


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    RuHomeComponent,
    RuLoginComponent,
    RuRegisterComponent,
    RuContactsComponent,
    PreloaderComponent
  ],
  exports: []
})
export class RuModuleModule { }
