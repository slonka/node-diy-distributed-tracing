function wrap(nodule, name, wrapper) {
  const original = nodule[name];
  const wrapped = wrapper(original);
  nodule[name] = wrapped;
}

module.exports = {
  wrap,
};
