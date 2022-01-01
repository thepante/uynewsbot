import processRedditPost from './processRedditPost.mjs';

function log(id, subreddit, msg, details=false) {
  console.log(`[${id}] [${subreddit}] ${msg}${details ? (' ⇢ ' + details) : ''}`);
}

export async function scanSubmission(req, res, snoowrap) {
    try {
        const { secret, subreddit, id } = req.headers;

        if (!secret || !subreddit || !id) {
            log('API', '******', 'Manual scan request', 'Invalid headers');
            return res.sendStatus(400);
        };

        if (id.length !== 6) {
            log(id, subreddit, 'Manual scan request', 'Invalid submission ID');
            return res.sendStatus(400);
        }

        if (secret === process.env.CLIENTSECRET) {
            log(id, subreddit, 'Manual scan request');
            const submission = await snoowrap.getSubmission(id).fetch();
            const r = submission.subreddit.display_name;
            if (subreddit !== r) {
                log(id, subreddit, 'Request error', 'Subreddit does not match');
                return res.sendStatus(400);
            }
            await processRedditPost(submission, true);
            return res.sendStatus(200);
        } else {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            log(id, subreddit, 'Manual scan request auth failed from IP', ip);
            return res.sendStatus(403);
        }

    } catch(err) {
        console.error('[API] Error ⇢', err);
        return res.sendStatus(500);
    }
}
