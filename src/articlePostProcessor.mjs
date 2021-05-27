import stripHtml from 'string-strip-html';
import nconf from 'nconf';

const MAX_LENGTH = 9200;
const truncateContent = (input) => input.length > MAX_LENGTH ? `${input.substring(0, MAX_LENGTH)}...(Truncado)` : input;

function sanitizeTitleLine(pInput) {
  if (typeof pInput !== 'string') return '';
  let sanitizedInput = stripHtml.stripHtml(pInput);
  sanitizedInput = (sanitizedInput && sanitizedInput.result) || '';
  return sanitizedInput.trim();
}

function calcReadingTime(content) {
  const wpm = 300;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
}

function buildTitleLink(article) {
  const title = sanitizeTitleLine(article.title);
  return '#### [' + title + '](' + article.url + ')\n\n';
}

function buildHeaderPostTitle(article, content) {
  let siteName = article.siteName.trim();
  const subsiteName = article.subsiteName;
  const byAuthor = (sanitizeTitleLine(article.byline) || '').trim();
  const readTime = calcReadingTime(content);
  const authorIsAPerson = byAuthor && byAuthor !== siteName && byAuthor !== article.altName;

  const authorName = authorIsAPerson ? `✎ ${byAuthor} | ` : '';
  siteName = (subsiteName ? `${subsiteName.trim()} · ` : '') + siteName;

  return `^(❯ **${siteName.toUpperCase()}** | ${authorName}◶ *${readTime} min.*)\n\n---\n\n`;
}

export default function articlePostProcessor(article) {
  const infoLink = process.env.INFOLINK || nconf.get('bot:link');
  const content = truncateContent(article.contentAsMd);
  let finalContent = buildTitleLink(article);
  finalContent += buildHeaderPostTitle(article, content);
  finalContent += content;
  finalContent += '\n\n___';
  if (article.paywallDetected) {
    finalContent += '\n\n^(Texto posiblemente truncado por paywall)';
  }
  finalContent += `\n\n[^(**bot info**)](${infoLink})^( | v${nconf.get('bot:version')} | Snapshot: ${article.dateTime})`;

  return finalContent;
}

