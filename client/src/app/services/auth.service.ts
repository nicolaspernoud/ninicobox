import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TokenResponse } from '../../../../common/interfaces';
import { environment } from '../../environments/environment';
import { switchMap } from 'rxjs/operators';
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

    logout() {
        this.loginInProgressOrLoggedSource.next(false);
        localStorage.removeItem(TOKEN_NAME);
        this.userRoleSubject.next(NOT_LOGGED);
    }

    autoLogin() {
        if (!this.isTokenExpired()) {
            this.userRoleSubject.next(this.getRoleFromToken());
        }
    }

    getAddressFromPosition(coords): Observable<Address> {
        // tslint:disable-next-line:max-line-length
        return this.http.get<Address>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`)
            .catch(handleHTTPError);
    }

    login(user) {
        this.loginInProgressOrLoggedSource.next(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                success => {
                    user.position = `latitude: ${success.coords.latitude}, longitude: ${success.coords.longitude}`;
                    this.getAddressFromPosition(success.coords)
                        .pipe(switchMap(
                            data => {
                                user.position += `, address: ${data.display_name}`;
                                return this.http.post<TokenResponse>(`${this.apiEndPoint}/unsecured/login`, user);
                            }
                        )).catch((e) => {
                            return this.http.post<TokenResponse>(`${this.apiEndPoint}/unsecured/login`, user);
                        }).subscribe(
                            data => {
                                this.setToken(data.token);
                                this.userRoleSubject.next(this.getRoleFromToken());
                                this.snackBar.open('Login success', 'OK', { duration: 2000 });
                                this.router.navigate(['/']);
                            });
                },
                error => {
                    if (error.code === 1) {
                        this.snackBar.open('Please allow geolocation to login', 'OK', { duration: 2000 });
                    } else {
                        this.snackBar.open('Geolocation failure', 'OK', { duration: 2000 });
                    }
                    this.loginInProgressOrLoggedSource.next(false);
                },
                { timeout: 2000 }
            );
        } else {
            this.snackBar.open('Browser not compatible', 'OK', {
                duration: 2000,
            });
        }
    }
}

interface Address {
    display_name: string;
}
