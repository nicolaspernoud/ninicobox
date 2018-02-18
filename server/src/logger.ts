import * as fs from 'fs';
import { Request } from 'express';
import * as maxmind from 'maxmind';

const ipDBLocation = process.env.IP_DB_LOCATION ? process.env.IP_DB_LOCATION : './config/GeoLite2-City.mmdb';
const lanIPsRegExs: RegExp[] = [/::1/, /.*127\.0.+/, /.*192\.168\..+/];
const logFile = process.env.LOG_FILE ? process.env.LOG_FILE : '../data/app.log';

export function log(message: string, req?: Request, customUser?: string) {
    const date = new Date().toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const user = customUser ? customUser : req && req.user ? req.user.login : 'unknown_user';
    const ip = req && req.ip ? req.ip : 'unknown_ip';

    // If the connection is from the local network, we write directly to the log
    if (lanIPsRegExs.some(rx => rx.test(ip))) {
        const city = 'local network';
        const entry = `${date} | ${user} | ${message} | ${ip} | ${city}\n`;
        fs.appendFile(logFile, entry, 'utf-8', err => console.log(err));
    }

    // If not, we lookup the location of the ip, before writing to the log
    else {
        maxmind.open(ipDBLocation, (err, cityLookup) => {
            let city: string;
            if (err) {
                console.log(err);
                city = 'unknown_location';
            }
            else {
                const cityObj = cityLookup.get('ip');
                city = cityObj ? `${cityObj.postal.code} ${cityObj.city.names['en']}, ${cityObj.country.names['en']}` : 'unknown location';
            }
            const entry = `${date} | ${user} | ${message} | ${ip} | ${city}\n`;
            fs.appendFile(logFile, entry, 'utf-8', err => console.log(err));
        });
    }
}

