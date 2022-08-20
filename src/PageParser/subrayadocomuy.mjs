import PageParserBase from "./PageParserBase.mjs";

export default class Elpaiscomuy extends PageParserBase {
    static name =  'Subrayado';
    static domainMatcher = [
        'subrayado.com.uy'
    ]
    selectorsToRemove = [
        '.news-headline__topic',
        '.recommended-news',
        '.temas-rel',
        '.articles-rel',
        '.widgetContent',
        '#comentarios',
        '.aside-section',
        '.embed_options'
    ];
}
