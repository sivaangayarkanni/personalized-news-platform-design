const express = require('express');
const app = express();
const PORT = 3005;

const trending = [
  { id: 'art_3', title: 'Sports Final Highlights', topic: 'sports', score: 2100 },
  { id: 'art_1', title: 'AI Breakthrough in 2026', topic: 'technology', score: 1200 }
];

app.get('/health', (req, res) => res.json({ service: 'trending', status: 'ok' }));

app.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  res.json({
    trending: trending.slice(0, limit),
    window: req.query.window || '1h',
    generated_at: new Date().toISOString()
  });
});

app.listen(PORT, () => console.log(`Trending Service running on port ${PORT}`));
