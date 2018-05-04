import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { File, TokenResponse } from '../../../../common/interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class FilesService {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    urlBase = `${environment.apiEndPoint}/secured/all/files`;

    constructor(private http: HttpClient, ) { }

    explore(permissions, basePath, filePath = '') {
        return this.executeRequest(`${this.getUrl(permissions, basePath, filePath)}/explore`);
    }

    createDir(permissions, basePath, filePath = '', directoryname) {
        return this.executeRequest(`${this.getUrl(permissions, basePath, filePath)}/createDir`, 'POST', {
            directoryname: directoryname
        });
    }

    renameOrCopy(permissions, basePath, oldpath, newpath, isCopy: boolean) {
        if (!isCopy) {
            return this.executeRequest(`${this.getUrl(permissions, basePath, oldpath)}/rename`, 'PUT', {
                newpath: newpath
            });
        } else {
            newpath = oldpath !== newpath ? newpath : newpath + ' (copy)';
            return this.executeRequest(`${this.getUrl(permissions, basePath, oldpath)}/copy`, 'PUT', {
                newpath: newpath
            });
        }
    }

    upload(permissions, basePath, filePath, file) {
        const formData: FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        return this.http.post(`${this.getUrl(permissions, basePath, filePath)}/upload`, formData);
    }

    getPreview(permissions, basePath, filePath) {
        return this.http.get(`${this.getUrl(permissions, basePath, filePath)}/download`, { responseType: 'blob' });
    }

    getContent(permissions, basePath, filePath) {
        return this.http.get(`${this.getUrl(permissions, basePath, filePath)}/getcontent`, { responseType: 'text' });
    }

    setContent(permissions, basePath, filePath, content) {
        return this.http.put(`${this.getUrl(permissions, basePath, filePath)}/setcontent`, content);
    }

    getShareToken(permissions, basePath, filePath): Observable<TokenResponse> {
        return this.http.get<TokenResponse>(`${this.getUrl(permissions, basePath, filePath)}/getsharetoken`);
    }

    delete(permissions, basePath, filePath, isDir) {
        return this.executeRequest(`${this.getUrl(permissions, basePath, filePath)}`, 'DELETE', { isDir: isDir });
    }

    private getUrl(permissions, basePath, filePath) {
        return `${this.urlBase}/${permissions}/${encodeURIComponent(basePath)}${filePath ? '/' + encodeURIComponent(filePath) : ''}`;
    }

    private executeRequest(url, method = 'GET', sentData = null, params = null) {
        return this.http.request<File[]>(method, url, {
            headers: this.headers,
            params: params,
            body: JSON.stringify(sentData)
        });
    }
}
