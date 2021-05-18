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

function getDateTime() {
  const date = new Date();
  return date.toLocaleString('en-US', {
		weekday: 'short',
  	day: '2-digit',
  	month: 'short',
  	year: 'numeric',
    hour: '2-digit',
  	minute: '2-digit',
    hour12: false,
    timeZone: 'America/Montevideo',
  }) + ' UTC-3';
}

function buildTitleLink(article) {
  const title = sanitizeTitleLine(article.title);
  return '#### [' + title + '](' + article.url + ')\n\n';
}

function buildHeaderPostTitle(article, content) {
  const parts = [];
  const siteName = (sanitizeTitleLine(article.siteName) || '').trim();
  const byAuthor = (sanitizeTitleLine(article.byline) || '').trim();
  const readTime = calcReadingTime(content);

  if (siteName && siteName !== 'mysitename') { //Busqueda, WTF? srsly?
    parts.push(`**${siteName.toUpperCase()}** | `);
  }
  if (byAuthor && byAuthor !== siteName) {
    parts.push(`✎ ${byAuthor} | `);
  }

  return `^(❯ ${parts.join('')}◶ *${readTime} min.*)\n\n---\n\n`;
}

export default function articlePostProcessor(article) {
  const content = truncateContent(article.contentAsMd);
  let finalContent = buildTitleLink(article);
  finalContent += buildHeaderPostTitle(article, content);
  finalContent += content;
  finalContent += '\n\n___';
  if (article.paywallDetected) {
    finalContent += '\n\n^(Texto posiblemente truncado por paywall)';
  }
  finalContent += `\n\n[^(**bot info**)](/#)^( | v${nconf.get('bot:version')} | Snapshot: ${getDateTime()})`;

  return finalContent;
}

