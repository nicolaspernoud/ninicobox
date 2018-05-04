
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { TokenResponse, Proxy } from '../../../../common/interfaces';
import { handleHTTPError } from '../utility_functions';

@Injectable()
export class ProxysService {

  private endpoint = `${environment.apiEndPoint}/secured/admin/proxys`;
  private tokenEndpoint = `${environment.apiEndPoint}/secured/admin/getproxytoken`;

  constructor(private http: HttpClient) { }

  getProxyToken(): Observable<TokenResponse> {
    return this.http
      .get<TokenResponse>(this.tokenEndpoint).pipe(
      catchError(handleHTTPError));
  }

  getProxys(): Observable<Proxy[]> {
    return this.http
      .get<Proxy[]>(this.endpoint).pipe(
      catchError(handleHTTPError));
  }

  setProxys(proxys: ClientProxy[]): Observable<ClientProxy[]> {
    const sendProxys: ClientProxy[] = [];
    proxys.forEach(proxy => {
      const sendProxy: ClientProxy = { ...proxy };
      delete sendProxy.completeUrl;
      sendProxys.push(sendProxy);
    }
    );
    return this.http
      .post<ClientProxy[]>(this.endpoint, sendProxys).pipe(
      catchError(handleHTTPError));
  }

}

export interface ClientProxy extends Proxy {
  completeUrl?: SafeResourceUrl;
}
