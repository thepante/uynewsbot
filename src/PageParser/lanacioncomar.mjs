import PageParserBase from "./PageParserBase.mjs";

export default class Lanacioncomar extends PageParserBase {
    static name = 'La Nacion';
    static domainMatcher = [
        'lanacion.com.ar'
    ]
    selectorsToRemove = [
        '.FirmaAutor',
        '.com-link',
        '.mod-headersection',
    ];
}

