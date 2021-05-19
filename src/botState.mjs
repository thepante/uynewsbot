import path from 'path';
import nconf from 'nconf';
import Database from 'better-sqlite3';

nconf.file('conf', path.join(process.cwd(), '.configuration.json'));

const isTestMode = process.env.ENVIRONMENT.toUpperCase() === 'TEST';

const db = new Database('data.db', isTestMode ? { verbose: console.log } : null);
const subreddits = nconf.get('subreddits');

for (const subreddit of subreddits) {
  db.prepare(`CREATE TABLE IF NOT EXISTS ${subreddit.id} (id text PRIMARY KEY)`).run();
}

export async function checkIfProcessed(submission) {
  const subreddit = submission.subreddit.display_name;
  return db.prepare(`SELECT id FROM ${subreddit} WHERE id = ?`).get(submission.id);
}

export async function flagAsProcessed(submission) {
  const subreddit = submission.subreddit.display_name;
  return db.prepare(`INSERT INTO ${subreddit} (id) VALUES(?)`).run(submission.id);
}
