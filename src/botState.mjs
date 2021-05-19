import path from 'path';
import nconf from 'nconf';
import cron from 'node-cron';
import Database from 'better-sqlite3';

nconf.file('conf', path.join(process.cwd(), '.configuration.json'));

const isTestMode = process.env.ENVIRONMENT.toUpperCase() === 'TEST';

const db = new Database('data.db', isTestMode ? { verbose: console.log } : null);
const subreddits = nconf.get('subreddits');

// tables creation
for (const subreddit of subreddits) {
  db.prepare(`CREATE TABLE IF NOT EXISTS ${subreddit.id} (id text PRIMARY KEY)`).run();
}

// autoclean oldest entries in tables. once per week
cron.schedule('1 0 * * Monday', function() {
  for (const subreddit of subreddits) {
    const r = subreddit.id;
    const keep = subreddit.limit * 3;
    const exec = db.prepare(`
      DELETE FROM ${r} WHERE ROWID IN (
        SELECT ROWID FROM ${r}
        ORDER BY ROWID DESC
        LIMIT -1 OFFSET ${keep}
      )
    `).run();
    console.log(`Cleaning table for ${r}, keep (max) newest ${keep} rows: ${exec.changes} deleted`);
  }
}, {
  timezone: "America/Montevideo"
});

export async function checkIfProcessed(submission) {
  const subreddit = submission.subreddit.display_name;
  return db.prepare(`SELECT id FROM ${subreddit} WHERE id = ?`).get(submission.id);
}

export async function flagAsProcessed(submission) {
  const subreddit = submission.subreddit.display_name;
  return db.prepare(`INSERT INTO ${subreddit} (id) VALUES(?)`).run(submission.id);
}
