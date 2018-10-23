import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnHomeComponent } from './en/home/home.component';
import { EnLoginComponent } from './en/login/login.component';
import { EnRegisterComponent } from './en/register/register.component';

import { RuHomeComponent } from './ru/home/home.component';
import { RuLoginComponent } from './ru/login/login.component';
import { RuRegisterComponent } from './ru/register/register.component';

const routes: Routes = [

    // en templates
  {path: '', redirectTo:'/en/home', pathMatch: 'full'},
  {path: 'en/home', component: EnHomeComponent},
  { path: 'en/login', component : EnLoginComponent},
  { path: 'en/register', component : EnRegisterComponent},

  // ru templates
  // {path: '', redirectTo:'/ru/home', pathMatch: 'full'},
  {path: 'ru/home', component: RuHomeComponent},
  { path: 'ru/login', component : RuLoginComponent},
  { path: 'ru/register', component : RuRegisterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
