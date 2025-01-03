
# **Twitter Scraper API Documentation**

## **Overview**
The Twitter Scraper API allows you to fetch and filter tweets, retrieve specific tweets by ID, and get user profiles. It provides a simple and flexible interface to interact with Twitter data using endpoints.

---

## **Table of Contents**
1. [Setup](#setup)
2. [Environment Variables](#environment-variables)
3. [API Endpoints](#api-endpoints)
   - [Fetch Tweets](#1-fetch-tweets)
   - [Fetch Latest Tweet](#2-fetch-latest-tweet)
   - [Fetch Tweet by ID](#3-fetch-tweet-by-id)
   - [Fetch Multiple Tweets by IDs](#4-fetch-multiple-tweets-by-ids)
   - [Fetch Filtered Tweets by IDs](#5-fetch-filtered-tweets-by-ids)
4. [Example Postman Requests](#example-postman-requests)

---

## **Setup**

### **Requirements**
- Node.js (v14 or later)
- npm or yarn

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/twitter-scraper-api.git
   cd twitter-scraper-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file (see [Environment Variables](#environment-variables)).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:3000`.

---

## **Environment Variables**

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
TWITTER_EMAIL=your_twitter_email
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET_KEY=your_twitter_api_secret_key
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
```

Replace the placeholders with your Twitter account credentials and API keys.

---

## **API Endpoints**

### **1. Fetch Tweets**

**Endpoint**: `POST /tweets`  
**Description**: Fetch a user's tweets.  

**Request Body**:
```json
{
  "user": "elonmusk",
  "maxTweets": 10
}
```

**Response**:
```json
{
  "success": true,
  "message": "Fetched tweets successfully",
  "data": [
    {
      "id": "1234567890",
      "text": "Hello Twitter!",
      "likes": 100,
      "retweets": 50
    },
    ...
  ]
}
```

---

### **2. Fetch Latest Tweet**

**Endpoint**: `POST /tweets/latest`  
**Description**: Fetch the latest tweet from a user.  

**Request Body**:
```json
{
  "user": "elonmusk"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Fetched latest tweet successfully",
  "data": {
    "id": "1234567890",
    "text": "Hello Twitter!",
    "likes": 100,
    "retweets": 50
  }
}
```

---

### **3. Fetch Tweet by ID**

**Endpoint**: `POST /tweets/by-id`  
**Description**: Fetch a tweet by its unique ID.  

**Request Body**:
```json
{
  "id": "1234567890"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Fetched tweet successfully",
  "data": {
    "id": "1234567890",
    "text": "Hello Twitter!",
    "likes": 100,
    "retweets": 50
  }
}
```

---

### **4. Fetch Multiple Tweets by IDs**

**Endpoint**: `POST /tweets/multiple`  
**Description**: Fetch multiple tweets by their IDs.  

**Request Body**:
```json
{
  "ids": ["1234567890", "9876543210"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Fetched tweets successfully",
  "data": [
    {
      "id": "1234567890",
      "text": "Hello Twitter!",
      "likes": 100,
      "retweets": 50
    },
    {
      "id": "9876543210",
      "text": "Another tweet!",
      "likes": 150,
      "retweets": 75
    }
  ]
}
```

---

### **5. Fetch Filtered Tweets by IDs**

**Endpoint**: `POST /tweets/filtered`  
**Description**: Fetch specific fields from multiple tweets by their IDs.  

**Request Body**:
```json
{
  "ids": ["1234567890", "9876543210"],
  "fields": ["id", "text", "likes"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Fetched filtered tweets successfully",
  "data": [
    {
      "id": "1234567890",
      "text": "Hello Twitter!",
      "likes": 100
    },
    {
      "id": "9876543210",
      "text": "Another tweet!",
      "likes": 150
    }
  ]
}
```

---

## **Example Postman Requests**

1. **Fetch Tweets**
   - **Method**: POST
   - **URL**: `http://localhost:3000/tweets`
   - **Body**:
     ```json
     {
       "user": "elonmusk",
       "maxTweets": 10
     }
     ```

2. **Fetch Latest Tweet**
   - **Method**: POST
   - **URL**: `http://localhost:3000/tweets/latest`
   - **Body**:
     ```json
     {
       "user": "elonmusk"
     }
     ```

3. **Fetch Tweet by ID**
   - **Method**: POST
   - **URL**: `http://localhost:3000/tweets/by-id`
   - **Body**:
     ```json
     {
       "id": "1234567890"
     }
     ```

4. **Fetch Multiple Tweets by IDs**
   - **Method**: POST
   - **URL**: `http://localhost:3000/tweets/multiple`
   - **Body**:
     ```json
     {
       "ids": ["1234567890", "9876543210"]
     }
     ```

5. **Fetch Filtered Tweets by IDs**
   - **Method**: POST
   - **URL**: `http://localhost:3000/tweets/filtered`
   - **Body**:
     ```json
     {
       "ids": ["1234567890", "9876543210"],
       "fields": ["id", "text", "likes"]
     }
     ```

---

## **Error Handling**

### Common Errors
- **400 Bad Request**: Missing or invalid parameters.
- **404 Not Found**: Tweet not found.
- **500 Internal Server Error**: An unexpected error occurred.

### Example Error Response
```json
{
  "success": false,
  "error": "Tweet ID is required"
}
```
# x-api
