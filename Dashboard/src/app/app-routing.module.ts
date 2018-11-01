import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from './location/home/home.component';
import { LoginComponent } from './location/login/login.component';
import { RegisterComponent } from './location/register/register.component';
import { ContactsComponent } from './location/contacts/contacts.component';
import { LocationComponent } from './location/location.component';
import { Location } from '@angular/common';

let prefix = localStorage.language;

// if(!prefix){
//   prefix = localStorage.language = 'EN'
// }

const routes: Routes = [

 
  {path: `${prefix}`, component : LocationComponent,
    children: [
      { path: `home`, component: HomeComponent},
      { path: `login`, component : LoginComponent},
      { path: `register`, component : RegisterComponent},
      { path: `contacts`, component: ContactsComponent},
    ]},
    { path: '**', redirectTo:`/${prefix}/home`, pathMatch: 'full'},
  
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

  let winPath = window.location.pathname;
  if(winPath.length > 2){
     localStorage.language = window.location.pathname.split('/')[1];
     _router.config[0].path = localStorage.language
  }
}
 }
