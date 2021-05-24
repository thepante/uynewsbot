import PageParserBase from "./PageParserBase.mjs";

export default class Infobaecom extends PageParserBase {
    static name = 'Infobae';
    static altName = 'anónimo';
    static domainMatcher = [
        'infobae.com'
    ]
    selectorsToRemove = [
        'figcaption',
        '.visual__image',
    ];
}

