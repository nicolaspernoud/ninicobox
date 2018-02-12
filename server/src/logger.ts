import * as fs from 'fs';
import { Request } from 'express';

export function log(message: string, req?: Request, customUser?: string) {
    const date = new Date().toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const user = customUser ? customUser : req && req.user ? req.user.login : 'unknown_user';
    const ip = req && req.ip ? req.ip : 'unknown_ip';
    const logFile = process.env.LOG_FILE ? process.env.LOG_FILE : '../data/app.log';
    const entry = `${date} | ${user} | ${message} | ${ip}\n`;
    fs.appendFile(logFile, entry, 'utf-8', err => console.log(err));
}