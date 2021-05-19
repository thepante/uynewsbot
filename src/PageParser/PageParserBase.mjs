import Readability from '@mozilla/readability';
import axios from 'axios';
import some from 'lodash/some.js';
import h2m from 'h2m';
import jQuery from 'jquery';
import buildJSDOM from '../JSDOMBuilder.mjs';

export default class PageParserBase {
    static domainMatcher = [];
    selectorsToRemove = [];
    h2mConfig = {
        converter: 'CommonMark', //CommonMark
        overides: {
            img: function() { return ''},
            a: function (a) {
                return a.md + '';
            },
            h1: function (node) {
                if (node.md) {
                    return `\n### ${node.md}\n`
                }
            },
            h2: function (node) {
                if (node.md) {
                    return `\n#### ${node.md}\n`
                }
            },
            h3: function (node) {
                if (node.md) {
                    return `\n##### ${node.md}\n`
                }
            },
            h4: function (node) {
                if (node.md) {
                    return `\n##### ${node.md}\n`
                }
            },
            h5: function (node) {
                if (node.md) {
                    return `\n###### ${node.md}\n`
                }
            },
            h6: function (node) {
                if (node.md) {
                    return `\n###### ${node.md}\n`
                }
            },
            b: function (node) {
                if (node.md) {
                    return `**${node.md}**`;
                }
            },
            p: function (node) {
                if (node.md) {
                  const bold = node.attrs?.class?.includes('prominent');
                  const p = bold ? `**${node.md.trim()}**` : node.md;
                  return `\n${p}\n\n`;
                }
            },
        }
    }
    constructor(url){
        this._url = url;
        this._originalContent = '';
        this._paywallDetected = false;
    }

    afterFetchFilter(data) {
        return data;
    }
    domFilter(dom) {
        const $ = jQuery(dom.window);
        (this.selectorsToRemove || []).forEach(function(id) {
            try {
                $(id).remove();
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
