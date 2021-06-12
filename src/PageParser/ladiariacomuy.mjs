import PageParserBase from "./PageParserBase.mjs";

export default class Ladiariacomuy extends PageParserBase {
    static name =  'La Diaria';
    static domainMatcher = [
        'ladiaria.com.uy'
    ];
    selectorsToRemove = [
        '#paywallmodal',
        '.softpaywall',
        '.softwall',
        '.ld-subscribe-box-wrap',
        '.article-date-author',
        'figcaption',
        '.ld-audio',
    ];
}
