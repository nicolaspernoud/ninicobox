import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UpdateService } from './services/update.service';
import { Router } from '@angular/router';
import { appAnimations } from './animations';
import { Infos } from '../../../common/interfaces';
import * as packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [appAnimations]
})
export class AppComponent implements OnInit {
  title = 'NinicoBox';
  isDarkTheme: boolean;
  infos: Infos = {
    server_version: '...',
    client_version: '...',
    bookmarks: []
  };
  loaded_client_version = (<any>packageJson).version;

  constructor(private authService: AuthService, private update: UpdateService, private router: Router) {
    authService.autoLogin();
  }

  ngOnInit() {
    this.authService.getInfos().subscribe(data => this.infos = data);
  }

  logout() {
    this.authService.logout();
  }
}
