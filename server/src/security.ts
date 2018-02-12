import * as express from 'express';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
import { getUsers, setUsers } from './models/users';
import { log } from './logger';

const env = process.env.NODE_ENV || 'development';

interface JwtOptions {
    jwtFromRequest: passportJWT.JwtFromRequestFunction;
    secretOrKey: string;
    jsonWebTokenOptions: jwt.SignOptions;
}

const jwtOptions: JwtOptions = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme('JWT'), ExtractJwt.fromUrlQueryParameter('JWT')]),
    secretOrKey: env === 'development' ? 'toBeUsedInDevelopmentOnly' : process.env.SECRET ? process.env.SECRET : randomString(48),
    jsonWebTokenOptions: { expiresIn: '1h' }
};

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    const users = getUsers();
    const user = users[_.findIndex(users, { id: jwt_payload.id })];
    const proxyUser = jwt_payload.role === 'proxy' ? { role: 'proxy' } : undefined;
    if (user) {
        next(undefined, user);
    } else if (proxyUser) {
        next(undefined, proxyUser);
    }
    else {
        next(undefined, false);
    }
});

export const authUser = function (req: express.Request, res: express.Response) {
    if (req.body.login && req.body.password) {
        const users = getUsers();
        const login = req.body.login;
        const password = req.body.password;
        const user = users[_.findIndex(users, { login: login })];
        if (!user) {
            log('Login failure : unknown user', req, login);
            res.status(401).json({ message: 'no such user found' });
        }
        if (bcrypt.compareSync(password, user.passwordHash)) {
            const payload = { id: user.id, role: user.role };
            const token = jwt.sign(payload, jwtOptions.secretOrKey, jwtOptions.jsonWebTokenOptions);
            log('Login success', req, user.login);
            res.json({ message: 'ok', token: token });
        } else {
            log('Login failure : wrong password', req, user.login);
            res.status(401).json({ message: 'passwords did not match' });
        }
    } else {
        res.status(401).json({ message: 'no username and password in request' });
    }
};

export const getProxyToken = function (req: express.Request, res: express.Response) {
    const payload = { role: 'proxy' };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, jwtOptions.jsonWebTokenOptions);
    res.json({ message: 'ok', token: token });
};

export const rolesFilter = function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const roles = req.params.roles.split('_');
    if (!(roles.includes(req.user.role) || roles[0] === 'all')) {
        log('Forbidden access', req);
        res.sendStatus(403);
        return;
    }
    next();
};

passport.use(strategy);

function randomString(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

