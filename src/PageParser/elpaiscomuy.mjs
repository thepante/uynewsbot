import PageParserBase from "./PageParserBase.mjs";

export default class Elpaiscomuy extends PageParserBase {
    static name = 'El País';
    static publisherSites = {
        'elpais.com.uy': '',
        'tvshow.com.uy': 'TVShow',
        'ovaciondigital.com.uy': 'Ovación',
    };
    static domainMatcher = Object.keys(this.publisherSites);
    selectorsToRemove = [
        '.report-error-container',
        '.contenido-exclusivo-nota',
        '.header-default',
        '.header-category',
        '.search-box-header',
        '.weather-header',
        '.middle-header',
        'header',
        '.modules-ads-container',
        '.ads-under-header',
        '.ads-under-header',
        'footer',
        '.composite-captioned-image',
        '.image-container',
        '.module-label',
    ];
    textsToIgnore = {
        i: [ 'este contenido es exclusivo para nuestros suscriptores.' ],
    };
    checkPaywalJSDOM(data) {
        const dom = data.window.document;
        return dom.querySelector('.contenido-exclusivo-nota.box-ui') != undefined;
    }
    static match(pUrl) {
        const matchDomain = super.match(pUrl);
        if (!matchDomain) {
            return false;
        }
        const url = new URL(pUrl);

        // Multimedia articles are 100% js widgets
        return url.pathname.indexOf('/multimedia/') === -1;
    }
}
