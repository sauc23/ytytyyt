const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');
const app = express();
const target = 'http://defaultgen.com:3050';
const mathProxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: function (proxyReq) {
    // Set the User-Agent header
    proxyReq.setHeader(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6301.219 Safari/537.36'
    );
  },
  onProxyRes: function (proxyRes, req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

    // Modify redirect locations if they point to IP-based domains
    const locationHeader = proxyRes.headers['location'];
    if (locationHeader) {
      const parsedUrl = url.parse(locationHeader);
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(parsedUrl.hostname)) { // Check if hostname is an IP
        proxyRes.headers['location'] = `${locationHeader}`;
      }
    }
  },
});

// Use the proxy middleware for all requests
app.use('/', mathProxy);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
