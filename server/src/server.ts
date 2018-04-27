import { app } from './app';
import * as fs from 'fs';
import * as https from 'https';

/**
 * Start Express HTTP server.
 */
const server = app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

/**
 * Start HTTPS server.
 */
if (process.env.SECURE_PORT) {
  const securePort = process.env.SECURE_PORT;
  const certPath = process.env.SSL_CERT_LOCATION ? process.env.SSL_CERT_LOCATION + '/fullchain.pem' : './certificates/localhost.crt';
  const keyPath = process.env.SSL_CERT_LOCATION ? process.env.SSL_CERT_LOCATION + '/private/privkey.pem' : './certificates/localhost.key';
  const options = {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath)
  };
  https.createServer(options, app).listen(securePort);
}