import * as request from 'supertest';
import { app } from '../src/app';

app.set('env', 'test');

describe('GET /api/secured/proxy?url=[http://example.com/] without authentication', () => {
  it('should return 401 Unauthorized', () => {
    return request(app).get('/api/secured/proxy?url=[http://example.com/]')
      .expect(401);
  });
});

describe('GET /api/secured/proxy?url=[http://example.com/] with authentication', () => {
  it('should return 200 OK', (done) => {
    const agent = request(app);
    agent
      .post('/api/unsecured/login')
      .send({ 'login': 'admin', 'password': 'password', 'position': 'test' })
      .end((req, res) => {
        agent
          .get('/api/secured/admin/getproxytoken')
          .set('Accept', 'application/json')
          .set('Authorization', 'JWT ' + res.body.token)
          .end((req, res) => {
            agent
              .get(`/api/secured/proxy?JWT=${res.body.token}&url=[http://example.com]`)
              .set('Accept', 'application/json')
              .expect(200, done);
          });
      });
  });
});
