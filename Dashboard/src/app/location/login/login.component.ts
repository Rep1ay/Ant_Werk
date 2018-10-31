import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
loginUserData = {};
showPreloader = true;
invalidAuth = false;
  constructor( private _authService: AuthService,
                private router: Router) {
                  
                 }

  ngOnInit() {
    setTimeout(() => {
    this.showPreloader = false;
    },2000)
  }

  loginUser( form: NgForm) {
    
    this._authService.loginUser(form.value)
    .subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate([`${localStorage.language}/${localStorage.location}`]);
        
        this._authService._state.subscribe(
          state => {debugger});
        window.location.reload();
      },
      (error) => {
        setTimeout(() => {
            this.invalidAuth = true;
        }, 500)
      
        console.log(error)}
    );
  }

  registerUser(){
    this.router.navigate([`${localStorage.language}/register`])
  }


}
