import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { File } from '../../../../common/interfaces';

@Injectable()
export class FilesService {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient) {
    }

    explore(urlBase, path = '') {
        return this.executeRequest(`${urlBase}${path.length > 0 ? '/' + encodeURIComponent(path) : ''}/explore`);
    }

    createDir(urlBase, path = '', directoryname) {
        return this.executeRequest(`${urlBase}${path.length > 0 ? '/' + encodeURIComponent(path) : ''}/createDir`, 'POST', {
            directoryname: directoryname
        });
    }

    rename(urlBase, oldpath, newpath) {
        return this.executeRequest(`${urlBase}${oldpath.length > 0 ? '/' + encodeURIComponent(oldpath) : ''}/rename`, 'PUT', {
            newpath: newpath
        });
    }

    upload(urlBase, path, file) {
        const formData: FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        console.log('urlBase :' + urlBase + 'path :' + path + 'file :' + file);
        return this.http.post(`${urlBase}${path.length > 0 ? '/' + encodeURIComponent(path) : ''}/upload`, formData)
            .toPromise()
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    download(urlBase, path) {
        this.http.get(`${urlBase}${path.length > 0 ? '/' + encodeURIComponent(path) : ''}/download`,
            { responseType: 'blob' }).subscribe(data => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(data);
                link.download = path.replace(/^.*[\\\/]/, '');
                link.click();
            });
    }

    delete(urlBase, path) {
        return this.executeRequest(`${urlBase}${path.length > 0 ? '/' + encodeURIComponent(path) : ''}`, 'DELETE');
    }

    private executeRequest(url, method = 'GET', sentData = null, params = null) {
        return this.http.request<File[]>(method, url, {
            headers: this.headers,
            params: params,
            body: JSON.stringify(sentData)
        });
    }
}
