import processRedditPost from './processRedditPost.mjs';

export async function scanSubmission(req, res, snoowrap) {
    try {
        const r = req.params.subreddit;
        const id = req.params.submission;
        const basicAuth = req.headers.authorization;

        if (!basicAuth.match(/^basic\s/i)) {
            console.log('Manual scan request → invalid auth type');
            return res.sendStatus(401);
        };

        if (id.length !== 6) {
            console.log('Manual scan request → invalid id:', id);
            return res.sendStatus(400);
        }

        const data = basicAuth.replace(/^Basic\s/, '').replace(/\s/g, '');
        const buff = new Buffer.from(data, 'base64');
        const auth = buff.toString('ascii');
        const valid = process.env.CLIENTID + ':' + process.env.CLIENTSECRET;

        if (auth === valid) {
            console.log('Manual scan request →', r, id);
            const submission = await snoowrap.getSubmission(id).fetch();
            const subreddit = submission.subreddit.display_name;
            if (r !== subreddit) {
                console.log('Manual scan request → subreddit does not match:', r, id);
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

