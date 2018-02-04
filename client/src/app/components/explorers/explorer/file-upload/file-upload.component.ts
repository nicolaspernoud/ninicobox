import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FilesService} from '../../../../services/files.service';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-upload.component.html'
})

export class FileUploadComponent {
    @Input() path;
    @Input() urlBase: string;
    @Output() UploadComplete: EventEmitter<void> = new EventEmitter<void>();

    constructor(private fileService: FilesService) {
    }

    onChange(event) {
        if (event.target.files.length > 0) {
            this.fileService.upload(this.urlBase, this.path, event.target.files[0]).then(() => {
                if (!!this.UploadComplete) {
                    this.UploadComplete.emit(event.target.files[0].name);
                }
            });
        }
    }
}
