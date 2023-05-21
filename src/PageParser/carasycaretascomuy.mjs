import PageParserBase from "./PageParserBase.mjs";

export default class Carasycaretascomuy extends PageParserBase {
    static name = 'Caras y Caretas';
    static domainMatcher = [
        'carasycaretas.com.uy'
    ];
    selectorsToRemove = [
        '.news-stopper',
        '.content_subscription',
        '.related-note-in-body',
        '.related-note-in-body-article',
        '.article-figure',
        '.thumb-wrap',
        '.section-newsletter',
        '.embed_cont',
        '.type_imagen',
    ];
    checkPaywalJSDOM(data) {
        const dom = data.window.document;
        const sel = '.entry-content .boton-comunidad a[href$="registro-socios/"]';
        return dom.querySelector(sel) != undefined;
    }
}

