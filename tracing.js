const http = require('http');

const {uuidv4} = require('./uuid');
const {wrap} = require('./shimmer');
const {namespace} = require('./namespace');

const PROPAGATE_HEADER_NAME = 'x-correlation-id';

wrap(http.Server.prototype, 'emit', function (original) {
  return function (event, incomingMessage, serverResponse) {
    let returned;
    if (event === 'request') {
      let uuid;
      if (incomingMessage.headers[PROPAGATE_HEADER_NAME]) {
        uuid = incomingMessage.headers[PROPAGATE_HEADER_NAME];
      } else {
        uuid = uuidv4();
      }
      serverResponse.setHeader(PROPAGATE_HEADER_NAME, uuid);
      namespace.run(() => {
        namespace.set('tid', uuid);
        returned = original.apply(this, arguments);
      });
    } else {
      returned = original.apply(this, arguments);
    }
    return returned;
  };
});

wrap(http, 'request', function (original) {
  return function (options) {
    options.headers = options.headers || {};
    options.headers[PROPAGATE_HEADER_NAME] = namespace.get('tid');
    return original.apply(this, arguments);
  };
});
