import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FilesService, } from '../../../services/files.service';
import { environment } from '../../../../environments/environment';
import { File } from '../../../../../../common/interfaces';
import { MatDialog } from '@angular/material';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';

@Component({
    selector: 'app-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.css'],
    providers: [FilesService]
})

export class ExplorerComponent implements OnInit {
    files: File[] = [];
    currentPath = '';
    @Input() name: string;
    @Input() permissions: string;
    @Input() basePath: string;
    @Output() CurrentPathChanged = new EventEmitter<[string, string]>();
    urlBase: string;

    constructor(private fileService: FilesService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.urlBase = `${environment.apiEndPoint}/secured/admin_user/files/${this.permissions}/${encodeURIComponent(this.basePath)}`;
        this.fileService.explore(this.urlBase, this.currentPath).subscribe(data => {
            this.files = data.sort(fileSortFunction);
        });
    }

    createDir() {
        let variant = 0;
        let directoryName = '';
        while (true) {
            directoryName = variant === 0 ? 'New folder' : `New folder ${variant}`;
            const existingFile = this.files.filter((file: File) => {
                return file.name.toLowerCase() === directoryName.toLowerCase();
            })[0];

            if (!existingFile) {
                break;
            }

            variant++;
        }

        this.fileService.createDir(this.urlBase, this.currentPath, directoryName).subscribe();
        this.files.push({
            name: directoryName,
            path: `${this.currentPath}\\${directoryName}`,
            isDir: true
        });
    }

    explore(file: File) {
        this.currentPath += '/' + file.name;
        this.CurrentPathChanged.emit([this.name, this.currentPath]);
        this.fileService.explore(this.urlBase, this.currentPath).subscribe(files => this.files = files.sort(fileSortFunction));
    }

    goBack() {
        this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/'));
        this.CurrentPathChanged.emit([this.name, this.currentPath]);
        this.fileService.explore(this.urlBase, this.currentPath).subscribe(files => this.files = files.sort(fileSortFunction));
    }

    openRename(file: File) {
        const dialogRef = this.dialog.open(RenameDialogComponent, { data: file });
        dialogRef.afterClosed().subscribe(fileAfterRename => {
            if (fileAfterRename && fileAfterRename.name) {
                const newPath = `${this.currentPath}/${fileAfterRename.name}`;
                this.fileService.rename(this.urlBase, file.path, newPath).subscribe(() => {
                    file.path = newPath;
                });
                this.files.sort(fileSortFunction);
            }
        });
    }

    download(file: File) {
        this.fileService.download(this.urlBase, file.path);
    }

    delete(file: File) {
        this.fileService.delete(this.urlBase, file.path, file.isDir).subscribe(() => {
            this.files = this.files.filter((item) => {
                return item.name.toLowerCase() !== file.name.toLowerCase();
            });
        });
    }

    onUploadComplete(name) {
        this.files.push({
            name: name,
            path: `${this.currentPath}\\${name}`,
            isDir: false
        });
    }
}

function fileSortFunction(a: File, b: File): number {
    if (a.isDir !== b.isDir) {
        return Number(a.isDir < b.isDir);
    } else {
        return a.name.localeCompare(b.name);
    }
}
