import PageParserBase from "./PageParserBase.mjs";

export default class Cnncom extends PageParserBase {
	static name =  'CNN';
	static domainMatcher = [
		'cnn.com'
	]
	selectorsToRemove = [
		'.ad-slot-dynamic',
		'img, figure, video',
	];
}
