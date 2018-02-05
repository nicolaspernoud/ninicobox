import * as express from 'express';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
import { getUsers, setUsers } from './models/users';

interface JwtOptions {
    jwtFromRequest: passportJWT.JwtFromRequestFunction;
    secretOrKey: string;
    jsonWebTokenOptions: jwt.SignOptions;
}

const jwtOptions: JwtOptions = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme('JWT'), ExtractJwt.fromUrlQueryParameter('JWT')]),
    secretOrKey: 'thisisnotsosecretchangeit',
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
            res.status(401).json({ message: 'no such user found' });
        }
        if (bcrypt.compareSync(password, user.passwordHash)) {
            // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
            const payload = { id: user.id, role: user.role };
            const token = jwt.sign(payload, jwtOptions.secretOrKey, jwtOptions.jsonWebTokenOptions);
            res.json({ message: 'ok', token: token });
        } else {
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
        res.sendStatus(403);
        return;
    }
    next();
};

passport.use(strategy);