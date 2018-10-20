import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './en/home/home.component';
import { LoginComponent } from './en/login/login.component';
import { RegisterComponent } from './en/register/register.component';

const routes: Routes = [
  {path: '', redirectTo:'/en/home', pathMatch: 'full'},
  {path: 'en/home', component: HomeComponent},
  { path: 'en/login', component : LoginComponent},
  { path: 'en/register', component : RegisterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
