const express = require('express');
const app = express();
const PORT = 3004;

app.use(express.json());

const notifications = [
  { id: 1, user_id: 1, message: 'New article in technology', type: 'new-article', read: false }
];

app.get('/health', (req, res) => res.json({ service: 'notification', status: 'ok' }));

app.get('/', (req, res) => {
  res.json(notifications);
});

app.post('/subscribe', (req, res) => {
  res.json({ message: 'Subscribed to notifications', topics: req.body.topics || [] });
});

app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
