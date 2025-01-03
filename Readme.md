
# **Twitter Scraper API Documentation**

## **Base URL**
`http://localhost:3000`

---

## **Endpoints**

### 1. **Fetch Tweets**
Fetches tweets from a user's timeline.

**Route**: `/tweets`

**Method**: `POST`

**Request Body**:
```json
{
  "username": "elonmusk",
  "maxTweets": 5
}
```

| Field      | Type   | Required | Description                                         |
|------------|--------|----------|-----------------------------------------------------|
| `username` | string | Yes      | The Twitter username to fetch tweets for.          |
| `maxTweets`| number | No       | The maximum number of tweets to fetch (default: 10).|

**Response**:
```json
{
  "success": true,
  "tweets": [
    {
      "id": "1234567890",
      "text": "Hello world!",
      "createdAt": "2025-01-04T12:00:00Z"
    }
  ]
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Username is required"
}
```

---

### 2. **Fetch Latest Tweet**
Fetches the most recent tweet from a user's timeline.

**Route**: `/tweets/latest`

**Method**: `POST`

**Request Body**:
```json
{
  "username": "elonmusk"
}
```

| Field      | Type   | Required | Description                                         |
|------------|--------|----------|-----------------------------------------------------|
| `username` | string | Yes      | The Twitter username to fetch the latest tweet for.|

**Response**:
```json
{
  "success": true,
  "tweet": {
    "id": "1234567890",
    "text": "This is my latest tweet!",
    "createdAt": "2025-01-04T14:30:00Z"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Failed to fetch the latest tweet"
}
```

---

### 3. **Send Tweet**
Posts a tweet on behalf of the authenticated user.

**Route**: `/tweets/send`

**Method**: `POST`

**Request Body**:
```json
{
  "text": "Hello, Twitter!",
  "replyToTweetId": "1234567890",
  "media": [
    {
      "data": "BASE64_ENCODED_IMAGE_STRING",
      "mediaType": "image/png"
    }
  ]
}
```

| Field            | Type   | Required | Description                                         |
|------------------|--------|----------|-----------------------------------------------------|
| `text`           | string | Yes      | The text of the tweet.                             |
| `replyToTweetId` | string | No       | The ID of the tweet to reply to.                   |
| `media`          | array  | No       | An array of media objects (base64-encoded data).   |

**Response**:
```json
{
  "success": true,
  "message": "Tweet sent successfully",
  "tweetId": "1234567890"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Tweet text is required"
}
```

---

## **Media Handling**
- **Base64 Encoding**: The `media` field expects an array of objects where each object contains:
  - `data`: Base64-encoded string of the media content.
  - `mediaType`: MIME type of the media (e.g., `image/png`, `video/mp4`).

### Example Media Object
```json
{
  "data": "BASE64_ENCODED_IMAGE_STRING",
  "mediaType": "image/png"
}
```

---

## **Authentication**
The API uses the `Scraper` class to authenticate with Twitter using:
1. Pre-stored cookies (if available).
2. Environment variables for Twitter credentials:
   - `TWITTER_USERNAME`
   - `TWITTER_PASSWORD`
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET_KEY`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_TOKEN_SECRET`

If cookies are valid, the scraper avoids logging in again to prevent rate-limiting issues.

---

## **Environment Variables**
| Variable                      | Required | Description                                     |
|-------------------------------|----------|-------------------------------------------------|
| `TWITTER_USERNAME`            | Yes      | The Twitter username for login.                |
| `TWITTER_PASSWORD`            | Yes      | The Twitter password for login.                |
| `TWITTER_EMAIL`               | No       | The email address for login (if required).     |
| `TWITTER_API_KEY`             | Yes      | The API key for Twitter API integration.       |
| `TWITTER_API_SECRET_KEY`      | Yes      | The API secret key for Twitter API integration.|
| `TWITTER_ACCESS_TOKEN`        | Yes      | The access token for Twitter API integration.  |
| `TWITTER_ACCESS_TOKEN_SECRET` | Yes      | The access token secret for Twitter API.       |

---

## **Error Handling**
- **400 Bad Request**: Missing or invalid request parameters.
- **401 Unauthorized**: Authentication failure (invalid credentials or cookies).
- **500 Internal Server Error**: Unexpected server-side issues.

### Common Errors
| Code | Description                         | Possible Solution                       |
|------|-------------------------------------|-----------------------------------------|
| 400  | Missing required field             | Ensure all required fields are included.|
| 401  | Authentication failed              | Verify credentials or re-login.         |
| 500  | Scraper initialization failed      | Check logs for detailed error messages. |

---

## **Setup**
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in a `.env` file:
   ```env
   TWITTER_USERNAME=your_username
   TWITTER_PASSWORD=your_password
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET_KEY=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_access_secret
   ```

3. Run the server:
   ```bash
   npm run start
   ```

---

## **Cookie Management**
Cookies are stored in `cookies.json` in the project directory. The scraper loads cookies if they exist and are valid, avoiding re-authentication to prevent rate-limiting by Twitter.

