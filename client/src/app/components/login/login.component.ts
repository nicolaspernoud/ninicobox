import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user = {
    login: '',
    password: ''
  };

  loginInProgressOrLogged: boolean;

  constructor(private _authService: AuthService, private location: Location) { }

  ngOnInit() {
    if (!this._authService.isTokenExpired()) {
      this.location.back();
    }
    this._authService.loginInProgressOrLogged.subscribe(value => this.loginInProgressOrLogged = value);
  }

  login() {
    this._authService.login(this.user);
  }
}

