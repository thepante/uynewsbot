import PageParserBase from "./PageParserBase.mjs";

export default class Elcascotenewscom extends PageParserBase {
    static name =  'El Cascote News';
    static domainMatcher = [
        'elcascotenews.com'
    ]
    selectorsToRemove = [
        '.wp-post-author-wrap',
        '.navigation-container',
        '#secondary',
        '.promotionspace'
    ];
}
