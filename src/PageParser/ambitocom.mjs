import PageParserBase from "./PageParserBase.mjs";

export default class Ambitocom extends PageParserBase {
    static name =  'Ámbito';
    static domainMatcher = [
        'ambito.com'
    ]
    selectorsToRemove = [
        'figure, figcaption',
        '.suggested-news',
        '.related-news',
        '.embed_cont.type_imagen',
        '.news-topics',
        '.class="suggested-news__title"',
    ];
}
