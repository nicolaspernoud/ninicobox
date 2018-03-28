import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilesService } from '../../../../services/files.service';
import { MatSnackBar } from '@angular/material';
import { CutCopyProgressBarComponent } from '../explorer.component';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-upload.component.html'
})

export class FileUploadComponent {
    @Input() path;
    @Input() basePath: string;
    @Output() UploadComplete: EventEmitter<void> = new EventEmitter<void>();

    constructor(private fileService: FilesService, public snackBar: MatSnackBar) {
    }

    onChange(event) {
        if (event.target.files.length > 0) {
            this.snackBar.openFromComponent(CutCopyProgressBarComponent);
            this.fileService.upload('rw', this.basePath, this.path, event.target.files[0]).subscribe(
                data => {
                    if (!!this.UploadComplete) {
                        this.UploadComplete.emit(event.target.files[0].name);
                    }
                },
                err => { console.log(err); });
        }
    }
}
