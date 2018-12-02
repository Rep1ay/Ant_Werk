import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // registerUserData: any;
  showPreloader = true;
  invalidAuth = false;
  errorMessage: string;
  constructor( private _auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.showPreloader = false;
    },2000)
  }

  registerUser(form: NgForm) {
    // this.registerUserData
    let _self = this;
    
    this._auth.registerNewUser(form.value).subscribe(
      (res) => {
        
        localStorage.setItem('token', res.token);
        this.router.navigate([`${localStorage.language}/${localStorage.location}`]);
        
        window.location.reload();
      },
      (error) => {
        setTimeout(() => {
          this.invalidAuth = true;
      }, 500);
      _self.errorMessage = error.error.message;
      console.error(error)}
    );
  }
}
