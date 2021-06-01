import stripHtml from 'string-strip-html';

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
  const authorIsAPerson = byAuthor && byAuthor.toLowerCase() !== siteName.toLowerCase() && byAuthor !== article.altName?.toLowerCase();

  const authorName = authorIsAPerson ? `✎ ${byAuthor} | ` : '';
  siteName = (subsiteName ? `${subsiteName.trim()} · ` : '') + siteName;

  return `^(❯ **${siteName.toUpperCase()}** | ${authorName}◶ *${readTime} min.*)\n\n---\n\n`;
}

function getPaywallNotice(siteName) {
  let text = `\n\n> ⚠️ Se detectó que se trata de una publicación de acceso exclusivo para suscriptores pagos a ${siteName}. `;
  text += 'La restricción no se puede evitar, y este humilde canillita no tiene cuentas pagas.\n';
  text += '> \n > El texto visible públicamente es el mencionado anteriormente.\n\n---';
  return text;
}

export default function articlePostProcessor(article) {
  const infoLink = process.env.INFOLINK ? `[^(**bot info**)](${process.env.INFOLINK})` : '';
  const content = truncateContent(article.contentAsMd);
  let finalContent = buildTitleLink(article);
  finalContent += buildHeaderPostTitle(article, content);
  finalContent += content;
  finalContent += '\n\n___';
  if (article.paywallDetected) {
    finalContent += getPaywallNotice(article.siteName);
  }
  finalContent += `\n\n${infoLink}^( ${infoLink ? '|' : 'bot'} v${process.env.npm_package_version} | Snapshot: ${article.dateTime})`;

  return finalContent;
}

