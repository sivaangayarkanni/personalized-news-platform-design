const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// In-memory store for demo
const users = [
  { id: 1, name: 'Alice', topics: ['technology', 'science'], email: 'alice@example.com' }
];

app.get('/health', (req, res) => res.json({ service: 'user', status: 'ok' }));

app.get('/me', (req, res) => {
  res.json(users[0]);
});

app.put('/preferences', (req, res) => {
  const { topics } = req.body;
  users[0].topics = topics || users[0].topics;
  res.json({ message: 'Preferences updated', user: users[0] });
});

app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
