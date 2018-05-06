import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RouteGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService) { }

    canActivate() {
        if (!this.authService.isTokenExpired()) {
            return true;
        }
        this.authService.logout();
        return false;
    }
}
