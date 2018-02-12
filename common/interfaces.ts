import { SafeResourceUrl } from '../client/node_modules/@angular/platform-browser';

export interface Proxy {
    name: string;
    url: string;
    customHeader?: string;
    icon?: string;
    completeUrl?: SafeResourceUrl;
}

export interface FilesAC {
    name: string;
    basepath: string;
    roles: string[];
    permissions: string;
}

export interface TokenResponse {
    message: string;
    token: string;
}

export interface User {
    id: number;
    login: string;
    name?: string;
    surname?: string;
    role: string;
    passwordHash?: string;
    password?: string;
}

export interface File {
    name: string;
    path: string;
    isDir: boolean;
}