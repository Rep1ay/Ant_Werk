import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from './location/home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactsComponent } from './contacts/contacts.component';
import { LocationComponent } from './location/location.component';
import { Location } from '@angular/common';

let prefix = localStorage.language;

// if(!prefix){
//   prefix = localStorage.language = 'EN'
// }
// debugger
const routes: Routes = [

  // { path: '', redirectTo:`/${prefix}/home`, pathMatch: 'full'},
  {path: `${prefix}`, component : LocationComponent,
    children: [
      { path: `home`, component: HomeComponent},
    ]},
  
  // { path: `${prefix}/login`, component : LoginComponent},
  // { path: `${prefix}/register`, component : RegisterComponent},
  // { path: `${prefix}/contacts`, component: ContactsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
constructor( private _activeRoute: ActivatedRoute, _router: Router, _location:Location){
  debugger
  let winPath = window.location.pathname;
  if(winPath.length > 2){
     localStorage.language = window.location.pathname.split('/')[1]
  }
}
 }
