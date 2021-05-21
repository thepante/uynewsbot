import PageParserBase from "./PageParserBase.mjs";
import jQuery from 'jquery';

export default class Ladiariacomuy extends PageParserBase {
    static name =  'La Diaria';
    static domainMatcher = [
        'ladiaria.com.uy'
    ];
    selectorsToRemove = [
        '#paywallmodal',
        '.softpaywall',
        '.ld-subscribe-box-wrap',
        '.article-date-author',
        'figcaption',
    ];
}
