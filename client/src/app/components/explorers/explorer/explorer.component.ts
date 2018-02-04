import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FilesService,  } from '../../../services/files.service';
import { environment } from '../../../../environments/environment';
import { File as BaseFile } from '../../../../../../common/interfaces';

interface File extends BaseFile {
    isRenaming?: boolean;
    oldName?: string;
}

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

    constructor(private fileService: FilesService) {
    }

    public renameFocusTriggeringEventEmitter = new EventEmitter<boolean>();

    ngOnInit() {
        this.urlBase = `${environment.apiEndPoint}/secured/admin_user/files/${this.permissions}/${encodeURIComponent(this.basePath)}`;
        this.fileService.explore(this.urlBase, this.currentPath).subscribe(data => {
            this.files = data.sort(fileSortFunction);
        });
    }

    onFileNameTextBoxBlur(file: File) {
        file.isRenaming = false;
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
            isDir: true,
            isRenaming: true
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

    rename(event, file: File) {
        event.stopPropagation();
        file.isRenaming = false;
        const newPath = this.currentPath + '/' + file.name;
        this.fileService.rename(this.urlBase, file.path, newPath).subscribe(() => {
            file.path = `${this.currentPath}\\${file.name}`;
        });
        this.files.sort(fileSortFunction);
    }

    cancelRename(event, file: File) {
        event.stopPropagation();
        file.isRenaming = false;
        file.name = file.oldName;
    }

    enterRenameMode(event, file: File) {
        this.renameFocusTriggeringEventEmitter.emit(true);
        event.stopPropagation();
        file.oldName = file.name;
        file.isRenaming = true;
    }

    download(event, file: File) {
        event.stopPropagation();
        this.fileService.download(this.urlBase, file.path);
    }

    delete(event, file: File) {
        event.stopPropagation();
        this.fileService.delete(this.urlBase, file.path).subscribe(() => {
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
