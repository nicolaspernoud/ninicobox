import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../common/interfaces';

@Injectable()
export class UsersService {

  private endpoint = `${environment.apiEndPoint}/secured/admin/users`;
  private tokenEndpoint = `${environment.apiEndPoint}/secured/admin/getproxytoken`;

  constructor(private http: HttpClient) {

  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.endpoint)
      .catch(this.handleError);
  }

  setUsers(users: User[]): Observable<void> {
    return this.http
      .post(this.endpoint, users)
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
