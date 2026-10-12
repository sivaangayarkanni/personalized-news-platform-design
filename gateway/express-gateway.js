// Sample Express.js API Gateway for the News Platform
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Route definitions
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/articles', createProxyMiddleware({
  target: 'http://article-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/articles': '' }
}));

app.use('/api/feed', createProxyMiddleware({
  target: 'http://feed-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/feed': '' }
}));

app.use('/api/notifications', createProxyMiddleware({
  target: 'http://notification-service:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '' }
}));

app.use('/api/trending', createProxyMiddleware({
  target: 'http://trending-service:3005',
  changeOrigin: true,
  pathRewrite: { '^/api/trending': '' }
}));

app.listen(PORT, () => {
  console.log(`News Platform API Gateway running on port ${PORT}`);
});
