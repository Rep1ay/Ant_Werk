import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from './location/home/home.component';
import { LoginComponent } from './location/login/login.component';
import { RegisterComponent } from './location/register/register.component';
import { ContactsComponent } from './location/contacts/contacts.component';
import { LocationComponent } from './location/location.component';
import { Location } from '@angular/common';
import { CareerComponent } from './location/career/career.component';

let prefix = localStorage.language;

if(!prefix){
  prefix = localStorage.language = 'en'
}

const routes: Routes = [

 
  {path: `${prefix}`, component : LocationComponent,
  
    children: [

      { path: `home`, component: HomeComponent},
      { path: `login`, component : LoginComponent},
      { path: `register`, component : RegisterComponent},
      { path: `contacts`, component: ContactsComponent},
      { path: `carrer`, component: CareerComponent},

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

  winPathname: any;
constructor( private _activeRoute: ActivatedRoute, _router: Router, _location:Location){

  this.winPathname = window.location.pathname.split('/');
  
  if(this.winPathname.length <= 2){
    let lang = localStorage.language
    if(lang){
      this.winPathname[0] = `/${lang}/`
      _router.config[0].path = lang
    }else{
      this.winPathname[0] = `/en/`;
      _router.config[0].path = `en`;
    }
    _location.go(`${lang}/${this.winPathname[1]}`)
  }
}
 }
