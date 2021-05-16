import Database from 'better-sqlite3';

const isTestMode = process.env.ENVIRONMENT.toUpperCase() === 'TEST';

const db = new Database('data.db', isTestMode ? { verbose: console.log } : null);
db.prepare('CREATE TABLE IF NOT EXISTS log(id text PRIMARY KEY)').run();

export async function checkIfProcessed(submission) {
  return db.prepare('SELECT id FROM log WHERE id = ?').get(submission.id);
}

export async function flagAsProcessed(submission) {
  return db.prepare('INSERT INTO log(id) VALUES(?)').run(submission.id);
}

