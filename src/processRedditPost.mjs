import path from 'path';
import nconf from 'nconf';
import parsePage from './PageParser/index.mjs';
import articlePostProcessor from './articlePostProcessor.mjs';
import { checkIfProcessed, flagAsProcessed } from './botState.mjs';

nconf.file('conf', path.join(process.cwd(), '.configuration.json'));

const subreddits = nconf.get('subreddits');

function log(msg, submission, url=false, details=false) {
  console.log(`[${submission.id}] [${submission.subreddit_name_prefixed}] ${msg}${details ? (' ⇢ ' + details) : ''}`);
  if (url)
    console.log(` ⤷ ${submission.url_overridden_by_dest}`);
}

export default async function processRedditPost(submission, force=false) {
  try {
    if (submission.is_self) {
      const logSP = (symbol, msg) => log(`[${symbol}] Self post ⇢ ${msg}`, submission);
      const rName = submission.subreddit.display_name.toLowerCase();
      const r = subreddits.filter(sub => sub.id.toLowerCase() === rName)[0];

      if (r.spFlair && (submission.link_flair_template_id === r.spFlair 
        || (typeof r.spFlair == 'object' && r.spFlair.includes(submission.link_flair_template_id) )) ) {
        const regex = /(.+)\((https?:\/\/[^\s]+)(?: "(.+)")?\)|(https?:\/\/[^\s]+)/;
        const detectedURL = submission.selftext.match(regex);
        const link = detectedURL?.[2] || detectedURL?.[4];
        if (!link)
          return logSP('!', 'No link detected');
        submission.url = link;
        submission.url_overridden_by_dest = link;
        logSP('✔', 'Flair matches ⇢ Got link');
      } else {
        return logSP('x', 'No flair matches');
      }
    }
    const isProcessed = await checkIfProcessed(submission);
    if (isProcessed) {
      log('Already processed', submission);
      if (!force) return;
    }
    // avoid TypeError [ERR_INVALID_URL] when is a crosspost starting without the domain
    if (submission.url_overridden_by_dest.match(/^\/(r|u(ser)?)\//)) {
      log('Crosspost link without domain', submission);
      submission.url_overridden_by_dest = submission.crosspost_parent_list[0].url;
    }
    if (!submission.url) {
      log('Submission is not a link', submission);
    }

    const postUrl = submission.url_overridden_by_dest.replace('www.google.com/amp/s/', '');

    if (postUrl.match(/.*\.pdf.*/i)) {
      log('Ignored: PDF link', submission, true);
      return;
    }

    if (postUrl.match(/.*\.(jpe?g|png|gif|bmp|webp).*/i)) {
      log('Ignored: image link', submission);
      return;
    }

    const pageParserResult = await parsePage(postUrl);
    if (!pageParserResult.success) {
      log('Error in process', submission, true, pageParserResult.error);
      return;
    }

    const commentsToMake = articlePostProcessor(pageParserResult);
    let parent = submission;

    for (const [index, comment] of commentsToMake.entries()) {
      parent = await parent.reply(comment);
      if (index !== 0) {
        await new Promise(resolve => setTimeout(resolve, 10_000));
      }
    }

    log(`Processed${commentsToMake.length > 1 ? ` (${commentsToMake.length} comments)` : ''}`, submission, true);
    if (!isProcessed && !force) {
      await flagAsProcessed(submission);
    }

  } catch(err) {
    console.error('ERROR', err);
    if (submission) {
      console.error('ERROR POST', submission.subreddit_name_prefixed, submission.url_overridden_by_dest, submission.id);
    }
  }
}

