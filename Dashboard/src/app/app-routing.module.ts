import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactsComponent } from './contacts/contacts.component';

let prefix = localStorage.language;
debugger
const routes: Routes = [

  { path: '', redirectTo:`/${prefix}/home`, pathMatch: 'full'},
  { path: `${prefix}/home`, component: HomeComponent},
  { path: `${prefix}/login`, component : LoginComponent},
  { path: `${prefix}/register`, component : RegisterComponent},
  { path: `${prefix}/contacts`, component: ContactsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
