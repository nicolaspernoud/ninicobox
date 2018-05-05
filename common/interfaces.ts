export interface Proxy {
    name: string;
    url: string;
    customHeader?: string;
    icon?: string;
    rank?: number;
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
    size: number;
    mtime: Date;
}

export interface Infos {
    server_version: string;
    client_version: string;
    bookmarks?: Bookmark[];
}

export interface Bookmark {
    name: string;
    url: string;
    icon: string;
}