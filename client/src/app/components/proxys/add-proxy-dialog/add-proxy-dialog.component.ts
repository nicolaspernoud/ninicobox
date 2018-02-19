import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-proxy-dialog',
  templateUrl: './add-proxy-dialog.component.html',
  styleUrls: ['./add-proxy-dialog.component.css']
})
export class AddProxyDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddProxyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
