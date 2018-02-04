import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public hide = true;

  public user = {
    login: '',
    password: ''
  };

  constructor(private _authService: AuthService) { }

  login() {
    this._authService.login(this.user);
  }
}

