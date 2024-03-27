
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


const target = 'https://phantomgames.dev/';

// Create the proxy middleware
const mathProxy = createProxyMiddleware({
  target,
  changeOrigin: true, // Needed for virtual hosted sites
  logLevel: 'debug',
});

// Use the proxy middleware for all requests
app.use('/', mathProxy);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
