import path from 'path';
import nconf from 'nconf';
import cron from 'node-cron';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import mongoose from 'mongoose';

dotenv.config();
nconf.file('conf', path.join(process.cwd(), '.configuration.json'));

const isTestMode = process.env.ENVIRONMENT.toUpperCase() === 'TEST';
const subreddits = nconf.get('subreddits');
const db_remote  = nconf.get('remote_db');

const REMOTE = {
  HOST: process.env.DBHOST,
  NAME: process.env.DBNAME,
  USER: process.env.DBUSER,
  PASS: process.env.DBPASS,
};
const URI = `mongodb+srv://${REMOTE.USER}:${REMOTE.PASS}@${REMOTE.HOST}/${REMOTE.NAME}?retryWrites=true&w=majority`;

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

// mongodb schemas for each subreddit
let collections = {};

// sql database
let db = null;

// db connect: remote uses mongodb, local uses sqlite
if (db_remote) {
  mongoose.connect(URI, mongooseOptions)
    .then(() => console.log('db connected'))
    .catch(err => console.log('db connection error:', err));
  console.log('Using remote db ->', REMOTE.HOST);
} else {
  db = new Database('data.db', isTestMode ? { verbose: console.log } : null);
}

// db tables/schema creation
for (const subreddit of subreddits) {
  if (db_remote) {
    const schema = new mongoose.Schema({ _id: String, }, { collection: subreddit.id });
    collections[subreddit.id] = mongoose.model(subreddit.id, schema);
  } else {
    db.prepare(`CREATE TABLE IF NOT EXISTS ${subreddit.id} (sid text PRIMARY KEY)`).run();
  }
}

// autoclean oldest entries in tables. once per month
cron.schedule('0 6 1 * *', async function() {
  for (const subreddit of subreddits) {
    const r = subreddit.id;
    const keep = subreddit.limit * 3;
    let exec = null;

    const log = n => console.log(`Cleaning table for ${r}, keep (max) newest ${keep} rows: ${n} deleted`);

    if (db_remote) {
      // mongo -> clean collection
      const total = await collections[r].countDocuments();
      const toDelete = Math.max(total - 20, 0);

      if (toDelete < 1) return;

      collections[r].find({}, { _id: true }).sort({ _id: 1 }).limit(toDelete).exec((err, docs) => {
        if (err) return console.error('error', err);
        const ids = docs.map(doc => doc._id);
        console.log("IDS TO DELETE", ids)
        return collections[r].deleteMany({ _id: ids }, (err, res) => {
          err ? console.error(err) : log(res.n);
        });
      });
    } else {
      // sql -> clean table
      exec = db.prepare(`
        DELETE FROM ${r} WHERE ROWID IN (
          SELECT ROWID FROM ${r}
          ORDER BY ROWID DESC
          LIMIT -1 OFFSET ${keep}
        )
      `).run();
      log(exec.changes);
    }

  }
}, {
  timezone: "America/Montevideo"
});

export async function checkIfProcessed(submission) {
  const subreddit = submission.subreddit.display_name;

  if (db_remote) {
    return await collections[subreddit].findOne({ _id: submission.id });
  } else {
    return db.prepare(`SELECT id FROM ${subreddit} WHERE id = ?`).get(submission.id);
  }
}

export async function flagAsProcessed(submission) {
  const subreddit = submission.subreddit.display_name;

  if (db_remote) {
    const record = new collections[subreddit]({ _id: submission.id });
    return await record.save();
  } else {
    return db.prepare(`INSERT INTO ${subreddit} (id) VALUES(?)`).run(submission.id);
  }
}
