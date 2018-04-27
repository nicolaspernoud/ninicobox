import * as fs from 'fs';
import { Request } from 'express';
import * as maxmind from 'maxmind';

const lanIPsRegExs: RegExp[] = [/::1/, /.*127\.0.+/, /.*192\.168\..+/];

const logFile = process.env.LOG_FILE ? process.env.LOG_FILE : '../data/app.log';

const maxmindOptions = {
    watchForUpdates: true,
    watchForUpdatesHook: () => { console.log('ip geolocation database updated !'); },
    cache: {
        max: 500
    }
};

export function log(message: string, req?: Request) {
    const date = new Date().toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const user = req && req.user && req.user.login ? req.user.login : req.body.login ? req.body.login : req.user.sharingUserLogin ? `shared by ${req.user.sharingUserLogin}` : 'unknown_user';
    const ip = req && req.ip ? req.ip : 'unknown_ip';

    // If the connection is from the local network, we write directly to the log
    if (lanIPsRegExs.some(rx => rx.test(ip)) || !process.env.GEO_IP_DATABASE_LOCATION) {
        const city = process.env.GEO_IP_DATABASE_LOCATION ? 'local network' : 'no ip geolocation database';
        const entry = `${date} | ${user} | ${message} | ${ip} | ${city}\n`;
        fs.appendFile(logFile, entry, 'utf8', err => { if (err) console.log(err); });
    }

    // If not, we lookup the location of the ip, before writing to the log
    else {
        maxmind.open(process.env.GEO_IP_DATABASE_LOCATION, maxmindOptions, (err, cityLookup) => {
            let city: string;
            if (err) {
                console.log(err);
                city = 'unknown_location';
            }
            else {
                const cityObj = cityLookup.get(ip);
                city = cityObj ? `${cityObj.postal ? cityObj.postal.code + ' ' : ''}${cityObj.city ? cityObj.city.names['en'] + ', ' : ''}${cityObj.country.names['en']}` : 'unknown location';
            }
            const entry = `${date} | ${user} | ${message} | ${ip} | ${city}\n`;
            fs.appendFile(logFile, entry, 'utf8', err => { if (err) console.log(err); });
        });
    }
}
