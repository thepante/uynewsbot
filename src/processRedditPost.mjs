import { checkIfProcessed, flagAsProcessed } from './botState.mjs';
import articlePostProcessor from './articlePostProcessor.mjs';
import parsePage from './PageParser/index.mjs';

function log(msg, submission, url=false) {
  console.log(
    msg,
    submission.subreddit_name_prefixed,
    ':',
    submission.id,
    url ? '- ' + submission.url_overridden_by_dest : ''
  )
}

export default async function processRedditPost(submission) {
  try {
    if (submission.is_self) {
      log('Submission is self post', submission);
      return;
    }
    const isProcessed = await checkIfProcessed(submission);
    if (isProcessed) {
      log('Already processed', submission);
      return;
    }
    if (!submission.url) {
      log('Submission is not a link', submission);
    }

    const postUrl = submission.url_overridden_by_dest;
    const pageParserResult = await parsePage(postUrl);
    if (!pageParserResult.success) {
      console.log('Error in process', submission.id, postUrl, pageParserResult.error);
      return;
    }

    const finalTextComment = articlePostProcessor(pageParserResult);

    await submission.reply(finalTextComment);
    log('Processed', submission, true);
    await flagAsProcessed(submission);

  } catch(err) {
    console.error('ERROR', err);
    if (submission) {
      console.error('ERROR POST', submission.subreddit_name_prefixed, submission.url_overridden_by_dest, submission.id);
    }
  }
}

