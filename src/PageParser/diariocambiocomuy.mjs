import PageParserBase from "./PageParserBase.mjs";

export default class Diariocambiocomuy extends PageParserBase {
    static name =  'Diario Cambio';
    static domainMatcher = [
        'diariocambio.com.uy'
    ]
    selectorsToRemove = [
        '.top-bar',
        '.post-cat',
        '.post-meta',
        '.navigation',
        '.publicidad',
        '.share-items',
        '#header',
        '.related-posts',
        '[role="complementary"]',
        '#footer'
    ];
}
