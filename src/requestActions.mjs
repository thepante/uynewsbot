import processRedditPost from './processRedditPost.mjs';

export async function scanSubmission(req, res, snoowrap) {
    try {
        const { secret, subreddit, id } = req.headers;

        if (!secret || !subreddit || !id) {
            console.log('Manual scan request → invalid headers');
            return res.sendStatus(400);
        };

        if (id.length !== 6) {
            console.log('Manual scan request → invalid id:', id);
            return res.sendStatus(400);
        }

        if (secret === process.env.CLIENTSECRET) {
            console.log('Manual scan request →', subreddit, id);
            const submission = await snoowrap.getSubmission(id).fetch();
            const r = submission.subreddit.display_name;
            if (subreddit !== r) {
                console.log('Manual scan request → subreddit does not match:', subreddit, id);
                return res.sendStatus(400);
            }
            await processRedditPost(submission, true);
            return res.sendStatus(200);
        } else {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            console.log('Manual scan request auth failed from ip:', ip);
            return res.sendStatus(403);
        }

    } catch(err) {
        console.error('Error [API] →', err);
        return res.sendStatus(500);
    }
}

