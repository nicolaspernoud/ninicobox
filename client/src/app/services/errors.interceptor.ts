import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar, private router: Router, private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .do((ev: HttpEvent<any>) => {
            })
            .catch((response: any) => {
                if (response instanceof HttpErrorResponse) {
                    if (response.status === 401 || response.status === 403) {
                        this.snackBar.open('Authentication error', 'Dismiss', {
                            duration: 3000,
                        });
                        this.injector.get(AuthService).logout();
                        this.router.navigate(['/login']);
                    }
                }

                return Observable.throw(response);
            });
    }

}
