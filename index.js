
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


const target = 'http://streamgeek.xyz:25461';

// Create the proxy middleware
const mathProxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  logLevel: 'debug',
  onProxyRes: function(proxyRes, req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  }
});


// Use the proxy middleware for all requests
app.use('/', mathProxy);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
