import stripHtml from 'string-strip-html';

const MAX_LENGTH = 9000;
const infoLink = process.env.INFOLINK ? `[^(**bot info**)](${process.env.INFOLINK})` : '';

function getSplittedContent(content) {
  const cutsNeeded = Math.ceil(content.length / MAX_LENGTH);
  let parts = [];
  for (let i = 0; i < cutsNeeded; i++) {
    const extract = content.slice(MAX_LENGTH * i, MAX_LENGTH * (i + 1));
    parts.push(extract);
  }
  // join last part with its previous, if its too
  // short to consider to be another whole comment
  if (parts.length > 1) {
    const charsToAcceptJoin = 600;
    const last = parts.length - 1;

    if (parts[last].length < charsToAcceptJoin) {
      parts[last-1] += parts[last];
      parts.splice(last, 1);
    }
  }
  return parts;
};


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

function buildHeaderPostTitle(article) {
  let siteName = article.siteName.trim();
  const subsiteName = article.subsiteName;
  const byAuthor = (sanitizeTitleLine(article.byline) || '').trim();
  const readTime = calcReadingTime(article.contentAsMd);
  const authorIsAPerson = byAuthor && byAuthor.toLowerCase() !== siteName.toLowerCase() && byAuthor.toLowerCase() !== article.altName?.toLowerCase();

  const authorName = authorIsAPerson ? `✎ ${byAuthor} | ` : '';
  siteName = (subsiteName ? `${subsiteName.trim()} · ` : '') + siteName;

  return `^(❯ **${siteName.toUpperCase()}** | ${authorName}◶ *${readTime} min.*)\n\n---\n\n`;
}

function getPaywallNotice(siteName) {
  let text = `\n\n> ⚠️ Se detectó que se trata de una publicación de acceso exclusivo para suscriptores pagos de ${siteName}. `;
  text += 'La restricción no se puede evitar, y este humilde canillita no tiene cuentas pagas.\n';
  text += '> \n > El texto visible públicamente es el mencionado anteriormente.\n\n---';
  return text;
}

export default function articlePostProcessor(article) {
  const parts = getSplittedContent(article.contentAsMd);
  const ellipsis = '[...]';
  const continueText = ellipsis + '\n\n*Continúa en las respuestas ⤵*';
  let comments = [];

  for (let i = 0; i < parts.length; i++) {
    let thisComment = '';

    // only first comment contains header
    if (i === 0) {
      thisComment += buildTitleLink(article);
      thisComment += buildHeaderPostTitle(article);
      thisComment += parts[0];
      thisComment += parts.length > 1 ? continueText : '';
      if (article.paywallDetected) {
        thisComment += getPaywallNotice(article.siteName);
      }
    } else {
      thisComment += ellipsis;
      thisComment += parts[i];
      thisComment += !!parts[i + 1] ? continueText : '';
    }
    thisComment += '\n\n---\n\n';
    thisComment += `${infoLink}^( ${infoLink ? '|' : 'bot'} v${process.env.npm_package_version} | Snapshot: ${article.dateTime})`;

    comments.push(thisComment);
  };

  return comments;
}

