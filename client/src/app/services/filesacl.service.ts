import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FilesAC } from '../../../../common/interfaces';

@Injectable()
export class FilesaclService {

  constructor(private http: HttpClient) { }

  getFilesACL(): Observable<FilesAC[]> {
    return this.http.get<FilesAC[]>(`${environment.apiEndPoint}/secured/all/filesacl`);
  }

}
