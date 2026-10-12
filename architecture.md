# Detailed Architecture Notes

## Service Communication Patterns

### Synchronous (Request Path)
- Client → API Gateway → Service (REST)
- Service → Service (only when low-latency required, e.g., Feed → User Preferences)

### Asynchronous (Event-Driven)
- Article publish → Kafka → multiple consumers
- Interaction events → Kafka → ranking & analytics

## Data Flow: Personalized Feed
1. User opens app → `GET /api/feed`
2. Gateway validates JWT
3. Feed Service:
   - Check Redis for cached feed (user_id)
   - If miss: fetch preferences + recent interactions
   - Rank articles (collaborative + content-based)
   - Cache result (TTL 2 min)
4. Return list of article IDs + metadata

## Data Flow: Breaking News
1. Editor publishes → Article Service
2. Write to PostgreSQL + Elasticsearch
3. Publish to Kafka `breaking-news`
4. Parallel consumers:
   - Notification Service (fan-out)
   - Trending Service (score boost)
   - Feed Service (cache invalidation)
