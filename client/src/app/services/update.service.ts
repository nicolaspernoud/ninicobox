import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable()
export class UpdateService {
    constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
        swUpdate.available.subscribe(evt => {
            this.snackbar
                .open('Update available', 'Update', { duration: 10000 })
                .onAction()
                .subscribe(() => {
                    swUpdate.activateUpdate().then(() => document.location.assign('/'));
                });
        });
        swUpdate.checkForUpdate(); // Check for updates at startup
    }
}
