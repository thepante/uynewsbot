import PageParserBase from "./PageParserBase.mjs";

export default class Pagina12comar extends PageParserBase {
    static name = 'Página|12';
    static domainMatcher = [
        'pagina12.com.ar',
    ]
    selectorsToRemove = [
      '.article-info',
      '.author',
      '.image-wrapper',
      '.ytp-cued-thumbnail-overlay',
      'figure',
      'figcaption',
    ];
}
