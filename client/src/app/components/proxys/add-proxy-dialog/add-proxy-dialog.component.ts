
import {catchError,  switchMap } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { handleHTTPError } from '../../../utility_functions';

@Component({
  selector: 'app-add-proxy-dialog',
  templateUrl: './add-proxy-dialog.component.html',
  styleUrls: ['./add-proxy-dialog.component.css']
})
export class AddProxyDialogComponent implements OnInit {

  public icons: Icon[];

  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<AddProxyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.http.get('https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints', { responseType: 'text' }).pipe(
      catchError(handleHTTPError))
      .subscribe(data => {
        this.icons = data.split('\n').map(line => {
          const icon = new Icon(line.split(' ')[0]);
          return icon;
        });
      });
  }
}

class Icon {
  name: string;
  value: string;
  constructor(name: string) {
    this.name = name;
    this.value = name.replace(/ /g, '_');
  }
}
