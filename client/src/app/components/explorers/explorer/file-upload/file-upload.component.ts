import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FilesService } from '../../../../services/files.service';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-upload.component.html'
})

export class FileUploadComponent implements OnInit {
    @Input() path;
    @Input() basePath: string;
    @Output() UploadComplete: EventEmitter<void> = new EventEmitter<void>();
    progress: number;

    constructor(private filesService: FilesService) {}

    ngOnInit() {
        this.filesService.uploadProgress.subscribe(value => {
            this.progress = value;
        });
    }

    onChange(event) {
        if (event.target.files.length > 0) {
            this.filesService.upload('rw', this.basePath, this.path, event.target.files[0]).subscribe(
                data => {
                    this.progress = 0;
                    if (!!this.UploadComplete) {
                        this.UploadComplete.emit(event.target.files[0].name);
                    }
                },
                err => { console.log(err); });
        }
    }
}
