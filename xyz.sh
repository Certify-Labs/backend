#!/bin/bash

# Create the project structure
echo "Creating project structure..."

mkdir -p twitter-scraper-api/src/{routes,controllers,utils}
cd twitter-scraper-api || exit

# Initialize npm and install dependencies
echo "Initializing npm..."
npm init -y > /dev/null
npm install express dotenv > /dev/null
npm install --save-dev typescript @types/express ts-node nodemon > /dev/null

# Create the TypeScript configuration file
echo "Creating tsconfig.json..."
cat > tsconfig.json <<EOL
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOL

# Create the .env file
echo "Creating .env file..."
cat > .env <<EOL
PORT=3000
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
TWITTER_EMAIL=your_twitter_email
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET_KEY=your_twitter_api_secret_key
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
EOL

# Create app.ts
echo "Creating app.ts..."
cat > src/app.ts <<EOL
import express from 'express';
import dotenv from 'dotenv';
import tweetsRoutes from './routes/tweets';
import profilesRoutes from './routes/profiles';

dotenv.config();

const app = express();
app.use(express.json());

// Register routes
app.use('/tweets', tweetsRoutes);
app.use('/profiles', profilesRoutes);

export default app;
EOL

# Create index.ts
echo "Creating index.ts..."
cat > src/index.ts <<EOL
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
EOL

# Create utils/scraper.ts
echo "Creating utils/scraper.ts..."
cat > src/utils/scraper.ts <<EOL
import { Scraper } from 'path-to-scraper';

const scraper = new Scraper();

export default scraper;
EOL

# Create utils/responseHandler.ts
echo "Creating utils/responseHandler.ts..."
cat > src/utils/responseHandler.ts <<EOL
export const handleResponse = (res: any, data: any, message = 'Success') => {
  res.status(200).json({ success: true, message, data });
};

export const handleError = (res: any, error: any) => {
  console.error('Error:', error);
  res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
};
EOL

# Create controllers/tweetsController.ts
echo "Creating tweetsController.ts..."
cat > src/controllers/tweetsController.ts <<EOL
import { Request, Response } from 'express';
import scraper from '../utils/scraper';
import { handleResponse, handleError } from '../utils/responseHandler';

export const getTweets = async (req: Request, res: Response) => {
  try {
    const { user, maxTweets } = req.query;
    const tweets = [];
    for await (const tweet of scraper.getTweets(user as string, parseInt(maxTweets as string) || 10)) {
      tweets.push(tweet);
    }
    handleResponse(res, tweets, 'Fetched tweets successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getLatestTweet = async (req: Request, res: Response) => {
  try {
    const { user } = req.query;
    const tweet = await scraper.getLatestTweet(user as string);
    handleResponse(res, tweet, 'Fetched latest tweet successfully');
  } catch (error) {
    handleError(res, error);
  }
};
EOL

# Create routes/tweets.ts
echo "Creating tweets routes..."
cat > src/routes/tweets.ts <<EOL
import { Router } from 'express';
import { getTweets, getLatestTweet } from '../controllers/tweetsController';

const router = Router();

router.get('/', getTweets);
router.get('/latest', getLatestTweet);

export default router;
EOL

# Create controllers/profilesController.ts
echo "Creating profilesController.ts..."
cat > src/controllers/profilesController.ts <<EOL
import { Request, Response } from 'express';
import scraper from '../utils/scraper';
import { handleResponse, handleError } from '../utils/responseHandler';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const profile = await scraper.getProfile(username as string);
    handleResponse(res, profile, 'Fetched profile successfully');
  } catch (error) {
    handleError(res, error);
  }
};
EOL

# Create routes/profiles.ts
echo "Creating profiles routes..."
cat > src/routes/profiles.ts <<EOL
import { Router } from 'express';
import { getProfile } from '../controllers/profilesController';

const router = Router();

router.get('/', getProfile);

export default router;
EOL

# Done
echo "Project structure created successfully!"
