import Database from 'better-sqlite3';

const db = new Database('data.db');
db.prepare('CREATE TABLE IF NOT EXISTS log(id text PRIMARY KEY)').run();

const isTestMode = () => process.env.ENVIRONMENT === 'test';

export async function checkIfProcessed(submission) {
  if (isTestMode()) {
    return false;
  }
  return db.prepare('SELECT id FROM log WHERE id = ?').get(submission.id);
}

export async function flagAsProcessed(submission) {
  if (isTestMode()) {
    return false;
  }
  return db.prepare('INSERT INTO log(id) VALUES(?)').run(submission.id);
}

