import { app } from './app';
import * as fs from 'fs';
import * as https from 'https';

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

export = server;


/**
 * Start HTTPS server.
 */
if (app.get('env') === 'production') {
  const securePort = process.env.SECURE_PORT ? process.env.SECURE_PORT : 443;
  const options = {
    cert: fs.readFileSync(process.env.SSL_CERT_LOCATION + '/fullchain.pem'),
    key: fs.readFileSync(process.env.SSL_CERT_LOCATION + '/privkey.pem')
  };
  https.createServer(options, app).listen(securePort);
}