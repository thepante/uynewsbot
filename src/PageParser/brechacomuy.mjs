import PageParserBase from "./PageParserBase.mjs";

export default class Brechacomuy extends PageParserBase {
    static name = 'Brecha';
    static domainMatcher = [
        'brecha.com.uy'
    ]
    selectorsToRemove = [
		'.summary > .breadcrumb',
        '.mepr-unauthorized-message',
        '.post-nav-related',
        '.articulo_categoria'
    ];
    checkPaywalJSDOM(data) {
        const dom = data.window.document;
        return dom.querySelector('.mepr-unauthorized-message') != undefined || dom.querySelector('.ArtPago') != undefined;
    }
}
