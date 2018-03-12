import * as request from 'supertest';
import { app } from '../src/app';
import { loginResponseIsOK } from './app.test';

app.set('env', 'test');

describe('Request a share token without authentication', () => {
  it('should return 401 Unauthorized status', (done) => {
    return request(app)
      .get('/api/secured/all/files/rw/..%2Fdata%2Fadmins/File%20admins%2001.txt/getsharetoken')
      .set('Accept', 'application/json')
      .expect(401, done);
  });
});

describe('Request a share token with authentication', () => {
  it('should return 200 Status', () => {
    const agent = request(app);
    agent
      .post('/api/unsecured/login')
      .send({ 'login': 'admin', 'password': 'password', 'position': 'test' })
      .end((req, res) => {
        agent
          .get('/api/secured/all/files/rw/..%2Fdata%2Fadmins/File%20admins%2001.txt/getsharetoken')
          .set('Accept', 'application/json')
          .set('Authorization', 'JWT ' + res.body.token)
          .expect(loginResponseIsOK);
      });
  });
});

describe('Try to download a file with the incorrect share token', () => {
  it('should return 403 Status', (done) => {
    const agent = request(app);
    agent
      .post('/api/unsecured/login')
      .send({ 'login': 'admin', 'password': 'password', 'position': 'test' })
      .end((req, res) => {
        agent
          .get('/api/secured/all/files/rw/..%2Fdata%2Fadmins/File%20admins%2001.txt/getsharetoken')
          .set('Accept', 'application/json')
          .set('Authorization', 'JWT ' + res.body.token)
          .end((req, res) => {
            agent
              .get('/api/secured/share/..%2Fdata%2Fadmins/File%20admins%2002.txt?JWT=' + res.body.token)
              .expect(403, done);
          });
      });
  });
});

describe('Try to download a file with the correct share token', () => {
  it('should return 200 Status', (done) => {
    const agent = request(app);
    agent
      .post('/api/unsecured/login')
      .send({ 'login': 'admin', 'password': 'password', 'position': 'test' })
      .end((req, res) => {
        agent
          .get('/api/secured/all/files/rw/..%2Fdata%2Fadmins/File%20admins%2001.txt/getsharetoken')
          .set('Accept', 'application/json')
          .set('Authorization', 'JWT ' + res.body.token)
          .end((req, res) => {
            agent
              .get('/api/secured/share/..%2Fdata%2Fadmins/File%20admins%2001.txt?JWT=' + res.body.token)
              .expect(200, done);
          });
      });
  });
});