import * as fs from 'fs';
import { Request } from 'express';

const logFile = process.env.LOG_FILE ? process.env.LOG_FILE : '../data/app.log';

export function log(message: string, req?: Request) {
    const date = new Date().toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const user = req && req.user ? req.user.login : req.body.login ? req.body.login : 'unknown_user';
    const position = req && req.user ? req.user.position : req.body.position ? req.body.position : undefined;
    const ip = req && req.ip ? req.ip : 'unknown_ip';

    const entry = `${date} | ${user} | ${message} | ${ip}${position ? ' | ' + position : ''}\n`;
    fs.appendFile(logFile, entry, 'utf-8', err => console.log(err));
}
