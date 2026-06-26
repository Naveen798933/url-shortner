# URL Shortener Service (Upgraded)

> A full-stack URL shortener application featuring a sleek UI, click analytics, custom aliases, rate limiting, and zero-config database setup.

## Features
- **Modern UI**: A responsive, beautifully designed frontend interface.
- **Custom Aliases**: Choose your own custom links (e.g. `http://localhost:5000/my-custom-link`).
- **Click Analytics**: Track how many times your short links are visited.
- **Rate Limiting**: Built-in API abuse protection (100 requests / 15 minutes).
- **Zero-Config Database**: Automatically spins up an in-memory MongoDB server for local testing if no `mongoURI` is provided.

## Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Or run in production
npm start
```

## Setup & Configuration
By default, the app uses `mongodb-memory-server` to automatically handle the database out of the box. 

If you want to connect to a persistent database (like MongoDB Atlas), edit `config/default.json` and provide your `mongoURI`.
```json
{
  "mongoURI": "mongodb+srv://<user>:<password>@cluster0.mongodb.net/shortener",
  "baseUrl": "http://localhost:5000"
}
```

## API Endpoints

### 1. Create a Short URL
**POST** `/api/url/shorten`
```json
// Request Body
{ 
  "longUrl": "https://www.example.com",
  "customAlias": "my-alias" // (Optional)
}

// Response
{
  "urlCode": "my-alias",
  "longUrl": "https://www.example.com",
  "shortUrl": "http://localhost:5000/my-alias",
  "clicks": 0
}
```

### 2. Get URL Stats
**GET** `/api/url/stats/:code`
Returns the current statistics for a given short code, including the number of clicks.
