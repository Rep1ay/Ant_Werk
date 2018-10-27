import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // registerUserData: any;
  constructor( private _auth: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  registerUser(form: NgForm) {
    // this.registerUserData

    this._auth.registerNewUser(form.value).subscribe(
      (res) => {
        debugger
        localStorage.setItem('token', res.token);
        this.router.navigate(['/en/home']);
        window.location.reload();
      },
      (error) => console.error(error)
    );
  }
}
