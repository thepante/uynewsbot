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

function buildTitleLink(article) {
  const title = sanitizeTitleLine(article.title);
  return '#### [' + title + '](' + article.url + ')\n\n';
}

function buildHeaderPostTitle(article) {
  const parts = [];
  const siteName = (sanitizeTitleLine(article.siteName) || '').trim();
  const byAuthor = (sanitizeTitleLine(article.byline) || '').trim();

  if (siteName && siteName !== 'mysitename') { //Busqueda, WTF? srsly?
    parts.push(`**${siteName.toUpperCase()}** |`);
  }
  if (byAuthor && byAuthor !== siteName) {
    parts.push(byAuthor + ' |');
  }

  return `^(❯ ${parts.join('')})\n\n---\n\n`;
}

export default function articlePostProcessor(article) {
  let finalContent = buildTitleLink(article);
  finalContent += buildHeaderPostTitle(article);
  finalContent += truncateContent(article.contentAsMd);
  finalContent += '\n\n___';
  if (article.paywallDetected) {
    finalContent += '\n\n^(Texto posiblemente truncado por paywall)';
  }
  finalContent += `\n\n^(Snapshot: ${article.date.replace(/\([\s\S]*?\)/g, '')})`;
  finalContent += `\n\n[Bot looking for new master](https://www.reddit.com/r/uruguay/comments/mqtxgv/se_busca_dev_ops_para_el_uynewsbot/) - Versión: ${nconf.get('bot:version')})`;

  return finalContent;
}

