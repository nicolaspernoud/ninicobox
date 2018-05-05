import { Infos } from '../../../common/interfaces';
import * as fs from 'fs';

export function getInfos(): Infos {
    const serverData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    const clientData = JSON.parse(fs.readFileSync('../client/package.json', 'utf-8'));
    const bookmarks = JSON.parse(fs.readFileSync('./config/bookmarks.json', 'utf-8'));
    return {
        server_version: serverData.version,
        client_version: clientData.version,
        bookmarks: bookmarks
    };
}