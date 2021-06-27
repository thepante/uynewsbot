import nconf from 'nconf';
import SnooStorm from 'snoostorm';
import Snoowrap from 'snoowrap';
import express from 'express';

import processRedditPost from './src/processRedditPost.mjs';
import { scanSubmission } from './src/requestActions.mjs';

nconf.file('conf', '.configuration.json');

console.log('Env:', process.env.ENVIRONMENT);

const ua = nconf.get('bot:userAgent');
const userAgent = ua.replace('@version@', process.env.npm_package_version);

const snoowrap = new Snoowrap({
     userAgent: userAgent,
      clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
      username: process.env.REDDITUSER,
      password: process.env.REDDITPASS,
});

const isTestMode = process.env.ENVIRONMENT.toUpperCase() === 'TEST';

function registerClient(clientConfig) {
  console.log('Registering', clientConfig);
  const client = new SnooStorm.SubmissionStream(snoowrap, {
    subreddit: clientConfig.id,
    limit: clientConfig.limit,
    pollTime: isTestMode ? 30000 : clientConfig.pollTime,
  });
  client.on('item', processRedditPost);
}

async function registerClients() {
  const clients = nconf.get('subreddits');
  const finalClients = isTestMode ? clients.filter(client => client.testMode === true) : clients;
  const delayBetweenRegistrations = 60000 / finalClients.length;

  for (const client of finalClients) {
    registerClient(client);
    if (!isTestMode) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenRegistrations));
    } else {
      console.log('Running as test mode');
    }
  }
}

registerClients();


// API
const app = express();
app.get("/", (req, res) => res.sendStatus(200));
app.post("/scan/:submission", (req, res) => scanSubmission(req, res, snoowrap));
app.listen(process.env.PORT);

