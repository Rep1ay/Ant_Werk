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
  constructor( private _auth: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  registerUser(form: NgForm) {
    // this.registerUserData
    
    this._auth.registerNewUser(form.value).subscribe(
      (res) => {
        
        localStorage.setItem('token', res.token);
        this.router.navigate([`${localStorage.language}/${localStorage.location}`]);
        
        window.location.reload();
      },
      (error) => console.error(error)
    );
  }
}
