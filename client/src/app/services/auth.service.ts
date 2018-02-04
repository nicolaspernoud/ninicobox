import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TokenResponse } from '../../../../common/interfaces';

export const TOKEN_NAME = 'jwt_token';
export const NOT_LOGGED = 'not_logged';

@Injectable()
export class AuthService {

    private userRoleSubject = new BehaviorSubject<string>(NOT_LOGGED);
    public userRole = this.userRoleSubject.asObservable();

    private url = 'http://localhost:3000';

    constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

    hasToken(): boolean {
        return localStorage.getItem(TOKEN_NAME) !== null;
    }

    getToken(): string {
        return localStorage.getItem(TOKEN_NAME);
    }

    setToken(token: string): void {
        localStorage.setItem(TOKEN_NAME, token);
    }

    getRoleFromToken(token?: string): string {
        if (!token) { token = this.getToken(); }
        if (!token) { return 'not_logged'; }
        const decoded = jwt_decode(token);
        return decoded.role;
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);
        if (decoded.exp === undefined) { return null; }
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token?: string): boolean {
        if (!token) { token = this.getToken(); }
        if (!token) { return true; }
        const date = this.getTokenExpirationDate(token);
        if (date === undefined) { return false; }
        return !(date.valueOf() > new Date().valueOf());
    }

    logout() {
        localStorage.removeItem(TOKEN_NAME);
        this.userRoleSubject.next(NOT_LOGGED);
    }

    autoLogin() {
        if (!this.isTokenExpired()) {
            this.userRoleSubject.next(this.getRoleFromToken());
        }
    }

    login(user): Observable<TokenResponse> {
        console.log('entering login');
        const loginObservable = this.http.post<TokenResponse>(`${this.url}/api/unsecured/login`, user);
        loginObservable.subscribe
            (data => {
                this.setToken(data.token);
                this.userRoleSubject.next(this.getRoleFromToken());
                this.snackBar.open('Login success', 'OK', {
                    duration: 2000,
                });
                this.router.navigate(['/']);
            });
        return loginObservable;

    }
}
