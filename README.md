# Streaming Helper API

A Netflix-style streaming platform API built with Node.js, Express, and MongoDB. Get movie/TV data, manage watchlists, and search content powered by TMDB.

## 🚀 Live API
`https://streaming-helper-production.up.railway.app/signup`

## 🔧 Quick Start

Clone Github Repo
Setup .env file (below)

```bash
npm install
npm run dev
```

**Environment Variables:**
```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
TMDB_API_KEY=your_tmdb_key
```

## 📚 API Endpoints

### Public Routes
```bash
# Movies
GET /movie/trending
GET /movie/:id/details
GET /movie/:id/trailers
GET /movie/:id/similar
GET /movie/:id/credits
GET /movie/:category

# TV Shows
GET /tv/trending
GET /tv/:id/details
GET /tv/:id/trailers
GET /tv/:id/similar
GET /tv/:id/credits
GET /tv/:category

# People
GET /person/:id/details
GET /person/:id/movie-credits
GET /person/:id/tv-credits
```

### Auth Required
```bash
# Authentication
POST /auth/signup
POST /auth/login
POST /auth/logout
GET /auth/auth-check

# Search
GET /search/movie/:query
GET /search/tv/:query
GET /search/person/:query
GET /search/history
DELETE /search/history/:id

# Watchlist
POST /watchlist/add
DELETE /watchlist/:id
GET /watchlist
GET /watchlist/status/:id

# Profile
GET /profile/me
PUT /profile/bio
GET /profile/users/:id
GET /profile/suggested
```

## 🛠️ Built With
Node.js • Express • MongoDB • JWT • TMDB API