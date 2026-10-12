# Personalized News Platform – High-Level System Design

**Round 3 – High-Level System Design Challenge (25 Marks)**

Design of a personalized news platform supporting **millions of users** and continuously changing news content.

## Problem Statement
Build a scalable system for:
- User registration & preferences
- News articles, topics, feeds
- Personalized recommendations
- Notifications & breaking news
- Trending news

## 1. System Architecture

Microservices architecture with API Gateway as single entry point.

### Core Services
| Service | Responsibility |
|---------|----------------|
| **User Service** | Registration, profile, preferences, auth |
| **Article Service** | CRUD for news articles, metadata |
| **Topic Service** | Topic taxonomy, categorization |
| **Feed Service** | Personalized feed generation, ranking |
| **Notification Service** | Push, email, in-app notifications |
| **Trending Service** | Real-time trending calculation |
| **Interaction Service** | Likes, views, shares, comments |

### High-Level Diagram (Mermaid)
```mermaid
graph TB
    Clients[Web / Mobile / Third-party] -->|HTTPS| Gateway[API Gateway<br/>NGINX or Express.js]
    Gateway --> UserSvc[User Service]
    Gateway --> ArticleSvc[Article Service]
    Gateway --> FeedSvc[Feed Service]
    Gateway --> NotifSvc[Notification Service]
    Gateway --> TrendSvc[Trending Service]

    UserSvc --> UserDB[(User DB - PostgreSQL)]
    ArticleSvc --> ArticleDB[(Article DB - PostgreSQL + Elasticsearch)]
    FeedSvc --> Redis[(Redis Cache)]
    NotifSvc --> Kafka[Kafka / Message Queue]
    TrendSvc --> Redis

    ArticleSvc --> Kafka
    Kafka --> FeedSvc
    Kafka --> NotifSvc
```

**API Gateway** routes traffic:
- `/api/users/*` → User Service
- `/api/articles/*` → Article Service
- `/api/feed/*` → Feed Service
- `/api/notifications/*` → Notification Service
- `/api/trending` → Trending Service

## 2. REST API Communication

All external communication via REST through the API Gateway. Internal services can use REST or gRPC.

### Key Endpoints

#### Users
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me`
- `PUT /api/users/preferences`

#### Articles
- `GET /api/articles/{id}`
- `GET /api/articles?topic=tech&page=1`
- `POST /api/articles` (admin/publisher)

#### Personalized Feed
- `GET /api/feed` → personalized articles based on preferences & interactions

#### Additional API: Get Trending News
- `GET /api/trending?limit=20&window=1h`
  - Returns top articles by views/shares in the last window
  - Cached heavily in Redis

#### Notifications
- `GET /api/notifications`
- `POST /api/notifications/subscribe`

## 3. Database Selection

| Data | Database | Reason |
|------|----------|--------|
| Users, preferences, profiles | **PostgreSQL** | ACID, relational, strong consistency |
| Articles, topics, metadata | **PostgreSQL** + **Elasticsearch** | Relational for writes; Elasticsearch for full-text search & filtering |
| User interactions (views, likes, shares) | **Cassandra** or **DynamoDB** | High write throughput, time-series friendly |
| Personalized feeds & rankings | **Redis** + precomputed in PostgreSQL | Fast reads |
| Notifications history | **MongoDB** or **PostgreSQL** | Flexible schema |
| Trending counters | **Redis** (sorted sets) | Real-time increments & top-N queries |

## 4. Caching Strategy

**Multi-layer caching:**
- **CDN** (CloudFront / Cloudflare) for static assets & public articles
- **Redis** for:
  - Trending news (sorted set: score = views + shares)
  - Popular articles (TTL 5–15 min)
  - User preferences & session
  - Pre-computed personalized feeds (TTL 2–5 min)
  - Frequently accessed topics

## 5. Messaging Design

**Apache Kafka** (or RabbitMQ / AWS SNS+SQS) as the backbone.

### Topics
- `new-article` – published when a new article is created
- `breaking-news` – high-priority alerts
- `topic-updates` – category or trending changes
- `user-notifications` – personalized notification events
- `interaction-events` – views, likes (for ranking & analytics)

## 6. Scalability

**Handling sudden traffic spikes (breaking news):**

1. **API Gateway** – NGINX with rate limiting + horizontal scaling behind a load balancer.
2. **Horizontal scaling** of all stateless services (Kubernetes / ECS).
3. **Caching** – 90%+ of feed and trending reads served from Redis.
4. **Async processing** – all heavy work via Kafka.
5. **Database read replicas** + connection pooling.
6. **Circuit breakers** & graceful degradation.
7. **Auto-scaling** policies based on CPU, request rate, and Kafka lag.
8. **CDN** absorbs public article traffic.

## Sample Application Code

This repository now includes runnable sample microservices that demonstrate the architecture.

### Project Structure
```
├── README.md
├── architecture.md
├── api-examples.md
├── nginx-gateway.conf
├── gateway/express-gateway.js
├── services/
│   ├── user-service/index.js
│   ├── article-service/index.js
│   ├── feed-service/index.js
│   ├── trending-service/index.js
│   └── notification-service/index.js
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Run Locally

```bash
# Install dependencies
npm install

# Terminal 1 - User Service
npm run start:user

# Terminal 2 - Article Service
npm run start:article

# Terminal 3 - Feed Service
npm run start:feed

# Terminal 4 - Trending Service
npm run start:trending

# Terminal 5 - Notification Service
npm run start:notification

# Terminal 6 - API Gateway
npm run start:gateway
```

### Test the Gateway
```bash
# Trending (additional API)
curl http://localhost:3000/api/trending?limit=5

# Personalized feed
curl http://localhost:3000/api/feed

# User preferences
curl http://localhost:3000/api/users/me

# Articles
curl http://localhost:3000/api/articles?topic=technology
```

### Run with Docker Compose
```bash
docker-compose up --build
```

---
*Designed for millions of concurrent users with continuous news ingestion and personalized delivery.*
