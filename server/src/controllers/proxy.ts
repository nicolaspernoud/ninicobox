'use strict';

import * as request from 'request';
import { Response, Request } from 'express';
import * as URL from 'url';
const replaceStream = require('replacestream');

export let doProxy = (req: Request, res: Response) => {
  // Get the url to the requested resource as a query parameter
  let url: string = req.originalUrl
    .match(/\[.+\]?/g)[0]
    .replace(/[\[\]]+/g, '');

  // Add http protocol if missing from url
  url = url.startsWith('http') ? url : 'http://' + url;

  // Get the base url to add before proxied url
  const proxyServerBase: string = `${req.protocol}://${req.hostname}${req.originalUrl.replace(/&url=.*/, '')}&url=`;

  // Object containing the initial request headers
  const requestToOptions: request.CoreOptions = {
    method: req.method,
    jar: true,
    followRedirect: false,
    headers: {},
    strictSSL: false
  };

  // Allow custom headers (Authorisation for example)
  const parsed_url = URL.parse(proxyServerBase, true);
  if (parsed_url.query && Object.prototype.hasOwnProperty.call(parsed_url.query, 'customHeader')) {
    const customHeader = (parsed_url.query['customHeader'] as string).split(':');
    requestToOptions.headers[customHeader[0]] = customHeader[1].trim();
  }

  // *** ALLOW PROXYING OF TRANSMISSION BITTORRENT CLIENT, REMOVE IF NOT USEFUL ***
  if (req.headers['x-transmission-session-id']) {
    requestToOptions.headers['X-Transmission-Session-Id'] = req.headers['x-transmission-session-id'];
  }

  // Building of the main request to proxified server and error handling
  const requestTo = request(url, requestToOptions);
  requestTo.on('error', function (err) {
    res.send(
      '(English) Error : Cannot access the proxified server / (Français) Erreur : Accès au serveur à proxyfier impossible'
    );
  });

  // *** ALLOW PROXYING OF TRANSMISSION BITTORRENT CLIENT, REMOVE IF NOT USEFUL ***
  if (req.headers['x-transmission-session-id'] && req.method === 'POST' && req.headers['content-type'].includes('text/plain')) {
    requestTo.json(JSON.parse(req.body));
  }

  // Transmitting the data according to content type
  if (req.method === 'POST') {
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      requestTo.form(req.body);
    }
    if (req.headers['content-type'].includes('json')) {
      requestTo.json(req.body);
    }
  }

  // The replacement function for code alteration
  function replaceFn() {
    const newProxiedUrl: string = URL.resolve(url, arguments[2]);
    return (`${arguments[1]}${proxyServerBase}[${newProxiedUrl}${arguments[3]}`);
  }

  // Copy proxied server responses headers to the response sent back to client
  requestTo.on('response', function (response) {

    // Handle redirection
    if (response.headers['location']) {
      res.redirect(proxyServerBase + '[' + URL.resolve(url, response.headers['location']) + ']');
      return; // No need to carry on
    }

    // Pass along headers and response status code
    let i = 0;
    while (i < response.rawHeaders.length) {
      res.setHeader(response.rawHeaders[i], response.rawHeaders[i + 1]);
      i = i + 2;
    }
    // Remove content-length since text replacements can increase it
    res.removeHeader('Content-Length');
    res.status(response.statusCode);

    // If the resource is code and must be altered (inner links to other resources must be altered to use the proxy), we do it
    const contentType = response.headers['content-type'];
    // const replaceRegex = /((?:background=|action=|href=|src=|url\()(?:"|'?))((?:\.?)(?:\/?)(?!data:|about:|\/)[^"'\)\()]+)(\)|"\)|'\)|"|')/g;
    const replaceRegexCSS = /((?:url\()(?:"|'?))((?:\.?)(?:\/?)[^"'\)\()]+)(\)|"\)|'\))/g;
    const replaceRegexHTML = /((?:background=|action=|href=|src ?= ?|url ?= ?)(?:"|'))((?:\.?)(?:\/?)(?!data:|about:|javascript:|\/)[^"'\)\()]+)("|')/g;
    const replaceXHROpenPrototype =
      `<head>
      <script>
      var originalXHROpen = window.XMLHttpRequest.prototype.open;
      window.XMLHttpRequest.prototype.open = function() {
          newArgs = [].slice.call(arguments);
          newArgs[1] = "${proxyServerBase}" + "[" + new URL(newArgs[1], "${url}").href + "]";
          return originalXHROpen.apply(this, newArgs);
      };
      </script>`;
    if (contentType !== undefined && (contentType.includes('css') || contentType.includes('html') || contentType.includes('javascript'))) {
      res.setHeader('content-type', contentType); // Put correct content type after code alteration
      if (contentType.includes('css')) {
        this
          .pipe(replaceStream(replaceRegexCSS, replaceFn))
          .pipe(res);
      } else if (contentType.includes('javascript') || contentType.includes('html')) {
        this
          .pipe(replaceStream(replaceRegexHTML, replaceFn))
          // Alter XMLHttpRequest open method to proxy ajax request
          .pipe(replaceStream('<head>', replaceXHROpenPrototype))
          .pipe(res);
      }
    }
    else {
      // If not (images, etc...) we pipe it normally
      this.pipe(res);
    }
  });
};