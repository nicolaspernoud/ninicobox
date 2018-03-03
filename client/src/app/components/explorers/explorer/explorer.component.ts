import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FilesService, } from '../../../services/files.service';
import { environment } from '../../../../environments/environment';
import { File } from '../../../../../../common/interfaces';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';
import { switchMap } from 'rxjs/operators/switchMap';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { OpenComponent } from './open/open.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.css'],
    providers: [FilesService],
    animations: [
        trigger(
            'appearDisappear', [
                transition(':enter', [
                    style({ transform: 'scale(0)', opacity: 0 }),
                    animate('200ms', style({ transform: 'scale(1)', opacity: 1 }))
                ]),
                transition(':leave', [
                    style({ transform: 'scale(1)', opacity: 1 }),
                    animate('200ms', style({ transform: 'scale(0)', opacity: 0 }))
                ])
            ]
        )
    ]
})

export class ExplorerComponent implements OnInit {
    files: File[] = [];
    currentPath = '';
    @Input() name: string;
    @Input() permissions: string;
    @Input() basePath: string;
    @Output() CurrentPathChanged = new EventEmitter<[string, string]>();
    urlBase: string;
    cutCopyFile: [File, boolean]; // Boolean is true if operation is a copy, false if it is a cut

    // tslint:disable-next-line:max-line-length
    constructor(private fileService: FilesService, public dialog: MatDialog, public snackBar: MatSnackBar, private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.urlBase = `${environment.apiEndPoint}/secured/all/files/${this.permissions}/${encodeURIComponent(this.basePath)}`;
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
                this.fileService.renameOrCopy(this.urlBase, file.path, newPath, false).subscribe(() => {
                    file.path = newPath;
                    file.name = fileAfterRename.name;
                });
                this.files.sort(fileSortFunction);
            }
        });
    }

    open(file: File, editMode: boolean) {
        let fileType: string;
        if (/(jpg|png|gif|svg|jpeg|pdf)$/.test(file.name.toLowerCase())) {
            fileType = 'image';
            if (/(pdf)$/.test(file.name.toLowerCase())) {
                fileType = 'other';
            }
            this.fileService.getPreview(this.urlBase, file.path).subscribe(data => {
                const src = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(data));
                const dialogRef = this.dialog.open(OpenComponent, {
                    data: {
                        url: src,
                        file: file,
                        fileType: fileType,
                        editMode: false
                    }
                });
            });
        } else if (this.isText(file)) {
            fileType = 'text';
            this.fileService.getContent(this.urlBase, file.path).subscribe(data => {
                const dialogRef = this.dialog.open(OpenComponent, {
                    data: {
                        content: data,
                        file: file,
                        fileType: fileType,
                        editMode: editMode
                    }
                });
                if (editMode) {
                    dialogRef.afterClosed().subscribe(newContent => {
                        if (newContent && newContent.content) {
                            this.fileService.setContent(this.urlBase, file.path, newContent.content).subscribe();
                        }
                    });
                }
            });
        }
    }

    cut(file: File) {
        this.cutCopyFile = [file, false];
    }

    copy(file: File) {
        this.cutCopyFile = [file, true];
    }

    paste() {
        const newPath = `${this.currentPath}/${this.cutCopyFile[0].name}`;
        const action = this.cutCopyFile[1] === true ? 'Copy' : 'Cut';
        this.snackBar.openFromComponent(CutCopyProgressBarComponent);
        this.fileService.renameOrCopy(this.urlBase, this.cutCopyFile[0].path, newPath, this.cutCopyFile[1])
            .pipe(switchMap(data =>
                this.fileService.explore(this.urlBase, this.currentPath)
            )).subscribe(data => {
                this.files = data.sort(fileSortFunction);
                this.snackBar.open(`${action} done`, 'OK', { duration: 3000 });
            });
        this.cutCopyFile = undefined;
    }

    download(file: File) {
        this.fileService.download(this.urlBase, file.path);
    }

    delete(file: File) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent);
        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.fileService.delete(this.urlBase, file.path, file.isDir).subscribe(() => {
                    this.files = this.files.filter((item) => {
                        return item.name.toLowerCase() !== file.name.toLowerCase();
                    });
                });
            }
        });
    }

    onUploadComplete(name) {
        this.files.push({
            name: name,
            path: `${this.currentPath}\\${name}`,
            isDir: false
        });
    }

    isText(file) {
        return /(txt|md|csv|sh|nfo|log)$/.test(file.name.toLowerCase());
    }
}

function fileSortFunction(a: File, b: File): number {
    if (a.isDir !== b.isDir) {
        return Number(a.isDir < b.isDir);
    } else {
        return a.name.localeCompare(b.name);
    }
}

@Component({
    selector: 'app-cut-copy-progress-bar',
    template: 'Operation in progress...<mat-progress-bar mode="indeterminate"></mat-progress-bar>',
    styles: [':host {font-size: 14px;}']
})
export class CutCopyProgressBarComponent { }
