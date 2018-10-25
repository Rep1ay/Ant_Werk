import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { environment } from './../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private stateSource = new Subject();
  _state = this.stateSource.asObservable();
  // private _apiUrl = environment['API_URL'];

  // private _registerUrl = 'http://68.183.30.119/api/register';
  // private _loginUrl = 'http://68.183.30.119/api/login';

  private _registerUrl = 'http://localhost:3000/api/register';
  private _loginUrl = 'http://localhost:3000/api/login';
  
  constructor( private http: HttpClient,
              private router: Router,
              ) { }

  selectedUser: User = {
    email: '',
    password: ''
  }

  isLoggedIn(state) {
    this.stateSource.next(state);
  }

  registerNewUser(user: User) {
    return this.http.post<any>(this._registerUrl, user);
  }
  loginUser(user: User) {
    debugger
    return this.http.post<any>(this._loginUrl,user);
  }

  checkDiscount(promoCode) {
    debugger
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  activePromoCode() {
    return !!localStorage.getItem('promoCode');
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('promoCode');
    this.router.navigate(['en/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

