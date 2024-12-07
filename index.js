const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const target = 'http://defaultgen.com:3050';

const mathProxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: function(proxyReq, req, res) {
    // Set the User-Agent header
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Linux; Android 11; DT2002C; Build/RKQ1.201217.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.4280.141 Mobile Safari/537.36 Firefox-KiToBrowser/124.0');
  },
  onProxyRes: function(proxyRes, req, res) {
    // Modify the response headers for CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    
    // Detect and handle redirects
    const locationHeader = proxyRes.headers['location'];
    if (locationHeader && /^https?:\/\/[\d.]+/.test(locationHeader)) {
      const url = new URL(locationHeader);
      proxyRes.headers['location'] = url.pathname + url.search; // Keep only the path and query
    }
  }
});

// Use the proxy middleware for all requests
app.use('/', mathProxy);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
