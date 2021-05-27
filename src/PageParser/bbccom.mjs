import PageParserBase from "./PageParserBase.mjs";

export default class Bbccom extends PageParserBase {
    static name =  'BBC';
    static domainMatcher = [
        'bbc.com'
    ]
    selectorsToRemove = [
        '[data-component="image-block"]',
        '[data-component="tag-list"]',
        '[data-component="see-alsos"]',
        '[data-component="topStories"]',
        '[data-e2e="image-placeholder"]',
        '[href="#end-of-recommendations"]',
        '[role="list"]',
        '#recommendations-heading',
        '#end-of-recommendations',
        '.bbc-cdrraw',
        'figcaption',
        'time',
    ];
}
