import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';

// Security middleware
import { authUser, rolesFilter, getProxyToken } from './security';
import * as passport from 'passport';

// Controllers (route handlers)
import * as proxyController from './controllers/proxy';
import { filesRouter } from './controllers/files';
import { getUsers, setUsers } from './models/users';
import { getFilesACL, setFilesACL } from './models/filesacl';
import { setProxys } from './models/proxys';
import { getProxys } from './models/proxys';

// Create Express server
export const app = express();
app.set('port', process.env.PORT || 80);
if (app.get('env') === 'production') { app.use(helmet()); }
app.use(passport.initialize());
app.use(compression());

// Development configuration
if (app.get('env') === 'development') {
  // Enable logger
  app.use(logger('dev'));
  // Allow CORS
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
  });
}

// Necessary to proxy POST request containing json or url encoded form data
app.use(
  bodyParser.json({
    type: function (req) {
      return (req.headers['content-type'].includes('json'));
    }
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'text/plain' }));

if (app.get('env') !== 'test') {
  // Handle redirection to https (but for let's encrypt challenge)
  app.get('/.well-known/acme-challenge/:fileid', function (req, res) {
    res.send(`Requesting ${req.params.fileid}`);
  });
  app.use(function (req, res, next) {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

// Unsecured app routes
app.get('/test', function (req, res) {
  res.send('This is a test !');
});

// Serving client
app.use(express.static('../client/dist'));

// Login route
app.post('/api/unsecured/login', authUser);

// Role based security
app.use('/api/secured/:roles', passport.authenticate('jwt', { session: false }), rolesFilter);

// Admin secured app routes
app.get('/api/secured/admin/getproxytoken', getProxyToken); // Get a token only for proxy (being authenticated as admin with admin token)
app.use('/api/secured/proxy', proxyController.doProxy); // The token can then be used to access proxy service
app.get('/api/secured/admin/users', (req, res) => res.json(getUsers()));
app.post('/api/secured/admin/users', function (req: express.Request, res: express.Response) {
  try {
    setUsers(req.body);
    res.json(getUsers());
  }
  catch (error) {
    console.log(error);
    res.send(error.message);
  }
});
app.get('/api/secured/admin/proxys', (req, res) => res.json(getProxys()));
app.post('/api/secured/admin/proxys', function (req: express.Request, res: express.Response) {
  try {
    setProxys(req.body);
    res.json(getProxys());
  }
  catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

// Common secured app routes
app.get('/api/secured/all/filesacl', (req, res) => res.json(getFilesACL()));
app.use('/api/secured/all/files', filesRouter);