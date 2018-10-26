import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnHomeComponent } from './home/home.component';
import { EnLoginComponent } from './login/login.component';
import { EnRegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { EnContactsComponent } from './contacts/contacts.component';
import { PreloaderComponent } from './preloader/preloader.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    EnHomeComponent,
    EnLoginComponent,
    EnRegisterComponent,
    EnContactsComponent,
    PreloaderComponent
  ],
  exports: []
})
export class EnModuleModule { }
