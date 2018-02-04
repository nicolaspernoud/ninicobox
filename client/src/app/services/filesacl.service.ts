import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FilesAC } from '../../../../common/interfaces';

@Injectable()
export class FilesaclService {

  constructor(private http: HttpClient) { }

  getFilesACL(): Observable<FilesAC[]> {
    return this.http.get<FilesAC[]>(`${environment.apiEndPoint}/secured/admin_user/filesacl`);
  }

}
