import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../common/interfaces';
import { handleHTTPError } from '../utility_functions';

@Injectable()
export class UsersService {

  private endpoint = `${environment.apiEndPoint}/secured/admin/users`;
  private tokenEndpoint = `${environment.apiEndPoint}/secured/admin/getproxytoken`;

  constructor(private http: HttpClient) {

  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.endpoint)
      .catch(handleHTTPError);
  }

  setUsers(users: User[]): Observable<void> {
    return this.http
      .post(this.endpoint, users)
      .catch(handleHTTPError);
  }

}
