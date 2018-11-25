const asyncHooks = require('async_hooks');
const fs = require('fs');
const util = require('util');

function debug(...args) {
  fs.writeSync(process.stdout.fd, `${util.format(...args)}\n`);
}

asyncHooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    debug(`Init ${type} resource: asyncId: ${asyncId} trigger: ${triggerAsyncId}`);
  },
  destroy(asyncId) {
    const eid = asyncHooks.executionAsyncId();
    debug(`Destroy resource: execution: ${eid} asyncId: ${asyncId}`);
  }
}).enable();

debug(`in top level: asyncId: ${asyncHooks.executionAsyncId()} trigger: ${asyncHooks.triggerAsyncId()}`);
setTimeout(() => {
  debug(`in timeout: asyncId: ${asyncHooks.executionAsyncId()} trigger: ${asyncHooks.triggerAsyncId()}`);
}, 1000);
