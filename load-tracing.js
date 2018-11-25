if (process.env['NAIVE']) {
  console.log('using naive tracing')
  require('./naive-tracing');
} else {
  require('./tracing');
}
