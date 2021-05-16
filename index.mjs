import nconf from 'nconf';
import SnooStorm from 'snoostorm';
import Snoowrap from 'snoowrap';
import express from 'express';
import axios from 'axios';

import processRedditPost from './src/processRedditPost.mjs';

nconf.file('conf', '.configuration.json');

console.log('Env:', process.env.ENVIRONMENT);

const snoowrap = new Snoowrap({
     userAgent: nconf.get('bot:userAgent'),
      clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
      username: process.env.REDDITUSER,
      password: process.env.REDDITPASS,
});

function registerClient(clientConfig) {
  console.log('Registering', clientConfig);
  const isTestMode = process.env.ENVIRONMENT === 'test';
  const client = new SnooStorm.SubmissionStream(snoowrap, {
    subreddit: clientConfig.id,
    limit: clientConfig.limit,
    pollTime: isTestMode ? 30000 : clientConfig.frequencyInMs
  });
  client.on('item', processRedditPost);
}

async function registerClients() {
  const clients = nconf.get('subreddits');
  const isTestMode = process.env.ENVIRONMENT === 'test';
  const finalClients = isTestMode ? clients.filter(val => val.testmode === true) : clients;
  const waitTimeBetweenRegistrations = 60000 / finalClients.length;

  for (const client of finalClients) {
    registerClient(client);
    if (!isTestMode) {
      await new Promise(resolve => setTimeout(resolve, waitTimeBetweenRegistrations));
    }
  }
}

registerClients();


// temp
const app = express();

app.get("/", (req, res) => {
  console.log(Date.now(), "ping");
  res.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  axios.get(`https://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

