import PageParserBase from "./PageParserBase.mjs";

export default class Tncomar extends PageParserBase {
    static name =  'TN';
    static domainMatcher = [
        'tn.com.ar'
    ]
    selectorsToRemove = [
		'#ad-slot-infeed',
		'.genoa_video',
		'figure, figcaption',
		'.article__tags',
    ]
}
