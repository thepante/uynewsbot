import PageParserBase from "./PageParserBase.mjs";

export default class Clarincom extends PageParserBase {
    static name = 'Clarín';
    static domainMatcher = [
        'clarin.com'
    ];
    selectorsToRemove = [
		'.embed-body-photo',
		'.related-photo',
		'.entry-share',
		'.entry-breadcrumb ul',
		'.entry-share + .entry-breadcrumb ul',
		'.embed-body-photo',
		'figcaption',
		'.videoCustomFooter',
		'#entry-tags',
		'#entry-newsletters',
		'.title-related',
		'.related',
    ];
}
