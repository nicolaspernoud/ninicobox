import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-proxy-dialog',
  templateUrl: './add-proxy-dialog.component.html',
  styleUrls: ['./add-proxy-dialog.component.css']
})
export class AddProxyDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddProxyDialogComponent>) { }

  ngOnInit() {
  }

}
