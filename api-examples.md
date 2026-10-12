# API Examples

## Get Trending News (Additional Required API)

```http
GET /api/trending?limit=10&window=1h
Authorization: Bearer <token>
```

**Response:**
```json
{
  "trending": [
    {
      "id": "art_123",
      "title": "Major Tech Announcement",
      "topic": "technology",
      "score": 15420,
      "published_at": "2026-10-12T09:00:00Z"
    }
  ],
  "generated_at": "2026-10-12T14:30:00Z"
}
```

## Personalized Feed
```http
GET /api/feed?page=1&limit=20
```

## Update Preferences
```http
PUT /api/users/preferences
Content-Type: application/json

{
  "topics": ["technology", "politics", "sports"],
  "notification_settings": {
    "breaking_news": true,
    "daily_digest": true
  }
}
```
