import PageParserBase from "./PageParserBase.mjs";

export default class Yahoocom extends PageParserBase {
	static name =  'Yahoo! News';
	static domainMatcher = [
		'news.yahoo.com'
	]
	selectorsToRemove = [
		'.caas-figure',
	];
}
