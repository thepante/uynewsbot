import PageParserBase from "./PageParserBase.mjs";

export default class Helveciacomuy extends PageParserBase {
	static name =  'Helvecia';
	static domainMatcher = [
		'helvecia.com.uy'
	]
	selectorsToRemove = [
		'img, figure, video',
	];
}
