const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/api', '/api/user', '/api/posts'],
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy Response:', {
          status: proxyRes.statusCode,
          path: req.path
        });
      }
    })
  );
};