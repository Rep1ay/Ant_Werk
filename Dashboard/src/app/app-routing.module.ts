import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactsComponent } from './contacts/contacts.component';
import { Location } from '@angular/common';

let prefix = localStorage.language;
const routes: Routes = [

  { path: '', redirectTo:`/${prefix}/home`, pathMatch: 'full'},
  { path: `${prefix}/home`, component: HomeComponent},
  { path: `${prefix}/login`, component : LoginComponent},
  { path: `${prefix}/register`, component : RegisterComponent},
  { path: `${prefix}/contacts`, component: ContactsComponent},
  // { path: '*', component: HomeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  constructor( _router: Router, _location: Location){


    // let windPath = window.location.pathname.split('/')[1];
    // _router.config.forEach(rout => {
    //   // 
    //   let pageRout = rout.path.split('/')[1];
    //   if(pageRout){
    //      pageRout 
    //   }
     
    // })

    // let loc =_location.path().replace('/', '');
 
    // let routConf = _router.config[1].path.split('/')[0];
    // let empty = '';
    // if(!localStorage.language){
    //   if(loc !== empty){
    //     localStorage.language = loc.split('/')[0];
    //     _router.config[1].path = loc;
    //   }
    // }else{
    //   _router.config[1].path = `${localStorage.language}/${loc.split('/')[1]}`
    // }

    // _router.config[0].path = _location.path().replace('/','');
    // _router.config[0].children[0].path = _location.path().replace('/', '');
// 

    // window.location.pathname = _router.config[1].path

  //   if(localStorage.language !== locPath){
  //     routConf = locPath;
  //  }
  // if( _router.config[1].path.split('/')[0] === "undefined"){
   
  // }
 

  debugger
  // _location.go(_router.config[1].path);
  }

}
