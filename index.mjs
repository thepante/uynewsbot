import nconf from 'nconf';
import SnooStorm from 'snoostorm';
import Snoowrap from 'snoowrap';
import express from 'express';
import pkg from "./package.json";

import processRedditPost from './src/processRedditPost.mjs';
import { scanSubmission } from './src/requestActions.mjs';

nconf.file('conf', '.configuration.json');

const production = process.env.ENVIRONMENT?.toLocaleLowerCase() === 'production';

let userAgent = nconf.get('bot:userAgent');
userAgent = userAgent.replace('@account@', nconf.get(production ? 'bot:account' : 'bot:accountDev'));
userAgent = userAgent.replace('@version@', (pkg?.version || process.env.npm_package_version) + (!production ? ' DEV TEST' : ''));

console.log('Env:', process.env.ENVIRONMENT, "| Port:", process.env.PORT);
console.log('UA:', userAgent);

const snoowrap = new Snoowrap({
	userAgent: process.env.REDDIT_UA,
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.REDDIT_CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS,
});

function registerClient(clientConfig) {
	console.log('Registering', clientConfig);
	const client = new SnooStorm.SubmissionStream(snoowrap, {
		subreddit: clientConfig.id,
		limit: clientConfig.limit,
		pollTime: production && clientConfig.pollTime ? clientConfig.pollTime : 10000,
	});
	client.on('item', processRedditPost);
}

async function registerClients() {
	const clients = nconf.get('subreddits');
	const finalClients = clients.filter(client => production == !client.testMode);
	const delayBetweenRegistrations = 60000 / finalClients.length;

	for (const client of finalClients) {
		registerClient(client);
		if (production) {
			await new Promise(resolve => setTimeout(resolve, delayBetweenRegistrations));
		} else {
			console.log('Running as dev mode');
		}
	}
}

registerClients();


// API
const app = express();
app.get("/", (req, res) => res.sendStatus(200));
app.get("/scan", (req, res) => scanSubmission(req, res, snoowrap));
app.get("/*", (req, res) => res.sendStatus(404));
app.listen(process.env.PORT);
