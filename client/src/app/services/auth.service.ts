import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TokenResponse, Infos } from '../../../../common/interfaces';
import { environment } from '../../environments/environment';
import { switchMap, catchError } from 'rxjs/operators';
import { handleHTTPError } from '../utility_functions';

export const TOKEN_NAME = 'jwt_token';
export const NOT_LOGGED = 'not_logged';

@Injectable()
export class AuthService {

    private loginInProgressOrLoggedSource = new BehaviorSubject<boolean>(false);
    loginInProgressOrLogged = this.loginInProgressOrLoggedSource.asObservable();

    private userRoleSubject = new BehaviorSubject<string>(NOT_LOGGED);
    public userRole = this.userRoleSubject.asObservable();

    private apiEndPoint = `${environment.apiEndPoint}`;

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

    getTokenRemainingMs(): number {
        const token = this.getToken();
        if (!token) { return 0; }
        const date = this.getTokenExpirationDate(token);
        if (date === undefined) { return 0; }
        return date.valueOf() - new Date().valueOf();
    }

    logout() {
        this.loginInProgressOrLoggedSource.next(false);
        localStorage.removeItem(TOKEN_NAME);
        this.userRoleSubject.next(NOT_LOGGED);
        this.router.navigate(['/login']);
    }

    autoLogin() {
        if (!this.isTokenExpired()) {
            this.userRoleSubject.next(this.getRoleFromToken());
            this.startSessionTimeout();
        }
    }

    login(user) {
        this.loginInProgressOrLoggedSource.next(true);
        return this.http.post<TokenResponse>(`${this.apiEndPoint}/unsecured/login`, user).subscribe(
            data => {
                this.setToken(data.token);
                this.userRoleSubject.next(this.getRoleFromToken());
                this.snackBar.open('Login success', 'OK', { duration: 2000 });
                this.router.navigate(['/']);
                this.startSessionTimeout();
            });
    }

    private startSessionTimeout() {
        timer(this.getTokenRemainingMs()).subscribe(val => {
            this.snackBar.open('Session expired, please login.', 'OK', { duration: 2000 });
            this.logout();
        });
    }

    getInfos(): Observable<Infos> {
        return this.http
            .get<Infos>(`${this.apiEndPoint}/unsecured/infos`).pipe(
                catchError(handleHTTPError));
    }
}
