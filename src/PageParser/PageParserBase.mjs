import Readability from '@mozilla/readability';
import axios from 'axios';
import some from 'lodash/some.js';
import h2m from 'h2m';
import buildJSDOM from '../JSDOMBuilder.mjs';

const bold = text => `**${text.trim()}**`;
const boldTitle = text => `\n${bold(text)}\n\n`;

// This helps to fix issues when the html tag itself contains spaces on the edges,
// making the md "tag" to not being properly applied because of that separation.
// With this method: bold or italics texts can be followed by a comma/parenthesis/etc
// without adding a space before them. But also keep spaces when should
function wrapBetween(input, tag) {
    let text = input.trim();
    if (text === '.') return input;
    let md = tag + text + tag;
    if (input.match(/^\s/)) md = ' ' + md;
    if (input.match(/\s$/)) md = md + ' ';
    return md;
};

export default class PageParserBase {
    static domainMatcher = [];
    selectorsToRemove = [];
    h2mConfig = {
        converter: 'CommonMark', //CommonMark
        overides: {
            img: function() { return ''},
            a: function (node) {
                if (node.md) {
                    const ignore = node.md.match(/https?:\/\/(t.co|bit.ly)/) != undefined;
                    return ignore ? '' : node.md;
                }
            },
            h1: function (node) {
                if (node.md) {
                    return boldTitle(node.md);
                }
            },
            h2: function (node) {
                if (node.md) {
                    return boldTitle(node.md);
                }
            },
            h3: function (node) {
                if (node.md) {
                    return boldTitle(node.md);
                }
            },
            h4: function (node) {
                if (node.md) {
                    return boldTitle(node.md);
                }
            },
            h5: function (node) {
                if (node.md) {
                    return boldTitle(node.md);
                }
            },
            h6: function (node) {
                if (node.md) {
                    return boldTitle(node.md);
                }
            },
            b: function (node) {
                if (node.md) {
                    return wrapBetween(node.md, '**');
                }
            },
            strong: function (node) {
                if (node.md) {
                    return wrapBetween(node.md, '**');
                }
            },
            p: function (node) {
                if (node.md) {
                  node.md = node.md.replace(/^-\s/, '');
                  const isBold = node.attrs?.class?.includes('prominent');
                  const p = isBold ? `${bold(node.md)}` : node.md;
                  return `\n${p}\n\n`;
                }
            },
            em: function (node) {
                if (node.md) {
                    return wrapBetween(node.md, '*');
                }
            },
            br: function (node) {
                return '  \n';
            },
        }
    }
    constructor(url){
        this._url = url;
        this._originalContent = '';
        this._paywallDetected = false;

        const domain = new URL(url).hostname.replace(/^(w{3}\.)/, '');
        this._subsiteName = this.constructor?.publisherSites?.[domain];
    }

    afterFetchFilter(data) {
        return data;
    }
    domFilter(dom) {
        const dom = data.window.document;
        (this.selectorsToRemove || []).forEach(function(selector) {
            try {
                dom.querySelectorAll(selector).forEach(node => node.remove());
            } catch (e) {
                console.error(e);
            }
        });
        return dom;
    }
    afterReadabilityFilter (article) {
        return article;
    }
    checkPaywalJSDOM() {
        return false;
    }

    async fetch() {
        const dateTime = new Date().toLocaleString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'America/Montevideo',
        }) + ' UTC-3';
        const page = await this._fetch(this._url);
        let data;
        if (!page.success) {
            return PageParserBase.createError(page.error || 'Not Parseable by readability');
        }

        data = page.data;
        this._originalContent = page.data;
        data = this.afterFetchFilter(data);

        let doc = buildJSDOM(data);

        this._paywallDetected = this.checkPaywalJSDOM(doc);

        doc = this.domFilter(doc);

        const isProbablyReaderable = Readability.isProbablyReaderable(
            doc.window.document,
            {
                minScore: 15,
                minContentLength: 100
            }
        );

        if (!isProbablyReaderable) {
            return PageParserBase.createError('Not Parseable by readability');
        }

        let article = new Readability.Readability(
            doc.window.document,
            {keepClasses: true}
        ).parse();

        article = this.afterReadabilityFilter(article);

        return {
            success: true,
            paywallDetected: this._paywallDetected,
            originalContent: this._originalContent,
            readabilityContent: article.content,
            contentAsMd: h2m(article.content, this.h2mConfig),
            byline: article.byline,
            title: article.title,
            siteName: this.constructor.name,
            altName: this.constructor.altName,
            subsiteName: this._subsiteName,
            url: this._url,
            dateTime,
        };
    }

    async _fetch(url) {
        const result = await axios.get(
            url,
            {
                headers: {
                    'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/80.2.3.6 Safari/537.36'
                }
            }
        );

        if ((result.headers['content-type'] + '').indexOf('text/') === -1) {
            return {
                success: false,
                error: 'It\'s not text content. Sorry oldhotdog'
            };
        }

        return {
            success: true,
            data: result.data
        };
    }
    static createError(message) {
        return {
            success: false,
            error: message
        };
    }
    static match(pUrl) {
        const url = new URL(pUrl);
        const hostname = url.hostname.toLowerCase().trim();
        return some(this.domainMatcher, function(d) {
            const domainToMatch = d.toLowerCase().trim();
            return domainToMatch === hostname || hostname.endsWith(`.${domainToMatch}`);
        })
    }
}
