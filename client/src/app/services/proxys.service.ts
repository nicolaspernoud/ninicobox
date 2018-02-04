import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';
import { SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { TokenResponse, Proxy } from '../../../../common/interfaces';

@Injectable()
export class ProxysService {

  private endpoint = `${environment.apiEndPoint}/secured/admin/proxys`;
  private tokenEndpoint = `${environment.apiEndPoint}/secured/admin/getproxytoken`;

  constructor(private http: HttpClient) { }

  getProxyToken(): Observable<TokenResponse> {
    return this.http
      .get<TokenResponse>(this.tokenEndpoint)
      .catch(this.handleError);
  }

  getProxys(): Observable<Proxy[]> {
    return this.http
      .get<Proxy[]>(this.endpoint)
      .catch(this.handleError);
  }

  setProxys(proxys: Proxy[]): Observable<void> {
    proxys.forEach(proxy => delete proxy.completeUrl);
    return this.http
      .post(this.endpoint, proxys)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    let errorMessage = '';
    if (error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}