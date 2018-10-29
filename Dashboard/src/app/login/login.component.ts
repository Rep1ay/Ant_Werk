import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';

import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
loginUserData = {};

  constructor( private _authService: AuthService,
                private router: Router) {
                  debugger
                 }

  ngOnInit() {

  }

  loginUser( form: NgForm) {
    
    this._authService.loginUser(form.value)
    .subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate([`${localStorage.language}/${localStorage.location}`]);
        
        this._authService._state.subscribe(
          state => {debugger});
        // window.location.reload();
      },
      (error) => console.log(error)
    );
  }

  registerUser(){
    this.router.navigate([`${localStorage.language}/register`])
  }


}
