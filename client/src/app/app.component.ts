import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UpdateService } from './services/update.service';
import { Router } from '@angular/router';
import { appAnimations } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [appAnimations]
})
export class AppComponent {
  title = 'NinicoBox';
  isDarkTheme: boolean;

  constructor(private authService: AuthService, private update: UpdateService, private router: Router) {
    authService.autoLogin();
    window.onfocus = () => {
      if (authService.isTokenExpired()) {
        authService.logout();
        router.navigate(['/login']);
      }
    };
  }

  logout() {
    this.authService.logout();
  }
}
