import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public injector: Injector) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.injector.get(AuthService);
        const isRequestToBackend = request.url.startsWith('/') || new URL(request.url).hostname === window.location.hostname;
        if (isRequestToBackend && authService.hasToken()) {
            request = request.clone({
                setHeaders: {
                    Authorization: `JWT ${authService.getToken()}`
                }
            });
        }
        return next.handle(request);
    }
}
