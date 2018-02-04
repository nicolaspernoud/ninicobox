import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NinicoBox';
  isDarkTheme: boolean;

  constructor(private authService: AuthService) {
    authService.autoLogin();
  }

  logout() {
    this.authService.logout();
  }
}
