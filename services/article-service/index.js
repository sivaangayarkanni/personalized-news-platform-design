const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

const articles = [
  { id: 'art_1', title: 'AI Breakthrough in 2026', topic: 'technology', views: 1200, published_at: '2026-10-12T10:00:00Z' },
  { id: 'art_2', title: 'Climate Summit Results', topic: 'science', views: 890, published_at: '2026-10-11T15:00:00Z' },
  { id: 'art_3', title: 'Sports Final Highlights', topic: 'sports', views: 2100, published_at: '2026-10-12T08:00:00Z' }
];

app.get('/health', (req, res) => res.json({ service: 'article', status: 'ok' }));

app.get('/', (req, res) => {
  const { topic } = req.query;
  const filtered = topic ? articles.filter(a => a.topic === topic) : articles;
  res.json(filtered);
});

app.get('/:id', (req, res) => {
  const article = articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

app.listen(PORT, () => console.log(`Article Service running on port ${PORT}`));
