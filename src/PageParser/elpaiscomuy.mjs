import PageParserBase from "./PageParserBase.mjs";
import jQuery from "jquery";

export default class Elpaiscomuy extends PageParserBase {
    static name =  'El País';
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
    checkPaywalJSDOM(dom) {
        const $ = jQuery(dom.window);
        return $('.contenido-exclusivo-nota.box-ui').length > 0
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
