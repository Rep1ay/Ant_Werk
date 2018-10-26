import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnHomeComponent } from './en/home/home.component';
import { EnLoginComponent } from './en/login/login.component';
import { EnRegisterComponent } from './en/register/register.component';

import { RuHomeComponent } from './ru/home/home.component';
import { RuLoginComponent } from './ru/login/login.component';
import { RuRegisterComponent } from './ru/register/register.component';
import { EnContactsComponent } from './en/contacts/contacts.component';
import { RuContactsComponent } from './ru/contacts/contacts.component';

let langPrefix = localStorage.language

const routes: Routes = [

    // en templates
  {path: '', redirectTo:`/${langPrefix}/home`, pathMatch: 'full'},
  {path: 'en/home', component: EnHomeComponent},
  { path: 'en/login', component : EnLoginComponent},
  { path: 'en/register', component : EnRegisterComponent},
  {path: 'en/contacts', component: EnContactsComponent},

  // ru templates
  // {path: '', redirectTo:'/ru/home', pathMatch: 'full'},
  {path: 'ru/home', component: RuHomeComponent},
  { path: 'ru/login', component : RuLoginComponent},
  { path: 'ru/register', component : RuRegisterComponent},
  {path: 'ru/contacts', component: RuContactsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
