const asyncHooks = require('async_hooks');

function getNamespace() {
  const context = new Map();

  const run = (fn) => {
    const eid = asyncHooks.executionAsyncId();
    context.set(eid, new Map());
    fn();
  }

  const set = (key, val) => {
    const eid = asyncHooks.executionAsyncId();
    context.get(eid).set(key, val);
  }

  const get = (key) => {
    const eid = asyncHooks.executionAsyncId();
    return context.get(eid).get(key);
  }

  return {
    run,
    set,
    get,
    context
  }
}

function createHooks(namespace) {
  function init(asyncId, type, triggerId, resource) {
    if (namespace.context.has(triggerId)) {
      namespace.context.set(asyncId, namespace.context.get(triggerId));
    }
  }

  function destroy(asyncId) {
    namespace.context.delete(asyncId);
  }

  const hook = asyncHooks.createHook({
    init,
    destroy
  });

  hook.enable();
}

const namespace = getNamespace();
createHooks(namespace);

module.exports = {
  namespace
}
