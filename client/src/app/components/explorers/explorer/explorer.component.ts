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
import * as path from 'path';
import { BasicDialogComponent } from '../../basic-dialog/basic-dialog.component';

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
    loading = true;
    @Input() name: string;
    @Input() permissions: string;
    @Input() basePath: string;
    @Output() CurrentPathChanged = new EventEmitter<[string, string]>();
    cutCopyFile: [File, boolean]; // Boolean is true if operation is a copy, false if it is a cut

    // tslint:disable-next-line:max-line-length
    constructor(private fileService: FilesService, public dialog: MatDialog, public snackBar: MatSnackBar, private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.fileService.explore(this.permissions, this.basePath, this.currentPath).subscribe(data => {
            this.files = data;
            this.files.sort(fileSortFunction);
            this.loading = false;
        });
    }

    create(isDir: boolean) {
        const newName = isDir ? 'New folder' : 'New file';
        let variant = 0;
        let newFileName = '';
        while (true) {
            newFileName = variant === 0 ? `${newName}${isDir ? '' : '.txt'}` : `${newName} ${variant}${isDir ? '' : '.txt'}`;
            const existingFile = this.files.filter((file: File) => {
                return file.name.toLowerCase() === newFileName.toLowerCase();
            })[0];

            if (!existingFile) {
                break;
            }

            variant++;
        }
        if (isDir) {
            this.fileService.createDir(this.permissions, this.basePath, this.currentPath, newFileName).subscribe();
        } else {
            this.fileService.setContent(this.permissions, this.basePath, path.join(this.currentPath, newFileName), '').subscribe();
        }
        this.files.push({
            name: newFileName,
            path: `${this.currentPath}\\${newFileName}`,
            isDir: isDir
        });
    }

    explore(file: File) {
        this.loading = true;
        this.currentPath += '/' + file.name;
        this.CurrentPathChanged.emit([this.name, this.currentPath]);
        this.fileService.explore(this.permissions, this.basePath, this.currentPath).subscribe(files => {
            this.files = files;
            this.files.sort(fileSortFunction);
            this.loading = false;
        });
    }

    goBack() {
        this.loading = true;
        this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/'));
        this.CurrentPathChanged.emit([this.name, this.currentPath]);
        this.fileService.explore(this.permissions, this.basePath, this.currentPath).subscribe(files => {
            this.files = files;
            this.files.sort(fileSortFunction);
            this.loading = false;
        });
    }

    openRename(file: File) {
        const dialogRef = this.dialog.open(RenameDialogComponent, { data: file });
        dialogRef.afterClosed().subscribe(fileAfterRename => {
            if (fileAfterRename && fileAfterRename.name) {
                const newPath = `${this.currentPath}/${fileAfterRename.name}`;
                this.fileService.renameOrCopy(this.permissions, this.basePath, file.path, newPath, false).subscribe(() => {
                    file.path = newPath;
                    file.name = fileAfterRename.name;
                });
                this.files.sort(fileSortFunction);
            }
        });
    }

    open(file: File, editMode: boolean) {
        const fileType = this.getType(file);
        if (fileType === 'text') {
            this.fileService.getContent(this.permissions, this.basePath, file.path).subscribe(data => {
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
                            this.fileService.setContent(this.permissions, this.basePath, file.path, newContent.content).subscribe();
                        }
                    });
                }
            });
        } else if (fileType === 'audio' || fileType === 'video' || fileType === 'image' || fileType === 'other') {
            this.fileService.getShareToken(this.permissions, this.basePath, file.path).subscribe(data => {
                // tslint:disable-next-line:max-line-length
                const url = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.apiEndPoint}/secured/share/${encodeURIComponent(this.basePath)}/${encodeURIComponent(file.path)}?JWT=${data.token}`);
                this.dialog.open(OpenComponent, {
                    data: {
                        url: url,
                        file: file,
                        fileType: fileType,
                        editMode: false
                    }
                });
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
        this.fileService.renameOrCopy(this.permissions, this.basePath, this.cutCopyFile[0].path, newPath, this.cutCopyFile[1])
            .pipe(switchMap(data =>
                this.fileService.explore(this.permissions, this.basePath, this.currentPath)
            )).subscribe(data => {
                this.files = data;
                this.files.sort(fileSortFunction);
                this.snackBar.open(`${action} done`, 'OK', { duration: 3000 });
            });
        this.cutCopyFile = undefined;
    }

    download(file: File, share: boolean) {
        this.fileService.getShareToken(this.permissions, this.basePath, file.path).subscribe(data => {
            const link = document.createElement('a');
            link.download = file.name;
            // tslint:disable-next-line:max-line-length
            link.href = `${environment.apiEndPoint}/secured/share/${encodeURIComponent(this.basePath)}/${encodeURIComponent(file.path)}?JWT=${data.token}`;
            console.log(link.download);
            if (share) {
                this.dialog.open(BasicDialogComponent, {
                    data: {
                        message1: 'The file will be available with the following link for 7 days :',
                        message2: link.href
                    }
                });
            } else {
                link.click();
            }
        });
    }

    delete(file: File) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent);
        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.fileService.delete(this.permissions, this.basePath, file.path, file.isDir).subscribe(() => {
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

    getType(file): string {
        if (/(txt|md|csv|sh|nfo|log)$/.test(file.name.toLowerCase())) { return 'text'; }
        if (/(jpg|png|gif|svg|jpeg)$/.test(file.name.toLowerCase())) { return 'image'; }
        if (/(mp3|wav|ogg)$/.test(file.name.toLowerCase())) { return 'audio'; }
        if (/(mp4|avi|mkv)$/.test(file.name.toLowerCase())) { return 'video'; }
        // if (/(pdf)$/.test(file.name.toLowerCase())) { return 'other'; }
    }
}

function fileSortFunction(a: File, b: File): number {
    if (a.isDir !== b.isDir) {
        if (a.isDir) { return -1; } else { return 1; }
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
