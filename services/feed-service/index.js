const express = require('express');
const app = express();
const PORT = 3003;

// Simple personalized feed demo (would call User + Article services in real system)
const sampleFeed = [
  { id: 'art_1', title: 'AI Breakthrough in 2026', topic: 'technology', score: 0.95 },
  { id: 'art_3', title: 'Sports Final Highlights', topic: 'sports', score: 0.82 }
];

app.get('/health', (req, res) => res.json({ service: 'feed', status: 'ok' }));

app.get('/', (req, res) => {
  res.json({
    user_id: 1,
    feed: sampleFeed,
    generated_at: new Date().toISOString()
  });
});

app.listen(PORT, () => console.log(`Feed Service running on port ${PORT}`));
