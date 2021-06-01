import path from 'path';
import nconf from 'nconf';
import cron from 'node-cron';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
nconf.file('conf', path.join(process.cwd(), '.configuration.json'));

const subreddits = nconf.get('subreddits');

const DB = {
  HOST: process.env.DBHOST,
  NAME: process.env.DBNAME,
  USER: process.env.DBUSER,
  PASS: process.env.DBPASS,
};
const URI = `mongodb+srv://${DB.USER}:${DB.PASS}@${DB.HOST}/${DB.NAME}?retryWrites=true&w=majority`;

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

// mongodb schemas for each subreddit
let collections = {};

// db connection
mongoose.connect(URI, mongooseOptions)
  .then(() => console.log('Connected to db ->', DB.HOST))
  .catch(err => console.log('db connection error:', err));

// db schemas creation
for (const subreddit of subreddits) {
  const subredditName = subreddit.id.toLowerCase();
  const schema = new mongoose.Schema({ _id: String, }, { collection: subredditName });
  collections[subredditName] = mongoose.model(subredditName, schema);
}

// autoclean oldest documents in collections. once per month
cron.schedule('0 6 1 * *', async function() {
  for (const subreddit of subreddits) {
    try {
      const r = subreddit.id.toLowerCase();
      const keep = subreddit.limit * 3;
      let exec = null;

      const log = n => console.log(`Cleaning table for ${r}, keep (max) newest ${keep} rows: ${n} deleted`);

      const total = await collections[r].countDocuments();
      const toDelete = total - keep;

      if (toDelete < 1) return;

      collections[r].find({}, { _id: true }).sort({ _id: 1 }).limit(toDelete).exec((err, docs) => {
        if (err) return console.error('error', err);
        const ids = docs.map(doc => doc._id);
        console.log("IDs to delete:", ids)
        return collections[r].deleteMany({ _id: ids }, (err, res) => {
          err ? console.error(err) : log(res.n);
        });
      });
    } catch(err) {
      console.error(err);
    }
  }
}, {
  timezone: "America/Montevideo"
});

export async function checkIfProcessed(submission) {
  const subreddit = submission.subreddit.display_name.toLowerCase();
  return await collections[subreddit].findOne({ _id: submission.id });
}

export async function flagAsProcessed(submission) {
  const subreddit = submission.subreddit.display_name.toLowerCase();
  const record = new collections[subreddit]({ _id: submission.id });
  return await record.save();
}
