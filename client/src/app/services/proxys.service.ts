import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
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
      .get<TokenResponse>(this.tokenEndpoint)
      .catch(handleHTTPError);
  }

  getProxys(): Observable<Proxy[]> {
    return this.http
      .get<Proxy[]>(this.endpoint)
      .catch(handleHTTPError);
  }

  setProxys(proxys: Proxy[]): Observable<void> {
    const sendProxys: Proxy[] = [];
    proxys.forEach(proxy => {
      const sendProxy: Proxy = { ...proxy };
      delete sendProxy.completeUrl;
      sendProxys.push(sendProxy);
    }
    );
    return this.http
      .post(this.endpoint, sendProxys)
      .catch(handleHTTPError);
  }

}
