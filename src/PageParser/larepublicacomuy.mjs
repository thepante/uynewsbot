import PageParserBase from "./PageParserBase.mjs";

export default class Larepublicacomuy extends PageParserBase {
    static name =  'La República';
    static domainMatcher = [
        'republica.com.uy'
    ]
    selectorsToRemove = [
        '.post-related',
        '.comments-template',
        '#comments',
        '#respond',
        '.sidebar',
        '.post-meta-wrap',
        '.post-share',
        'figure'
    ];
}
