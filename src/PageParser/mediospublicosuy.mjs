import PageParserBase from "./PageParserBase.mjs";

export default class Mediospublicosuy extends PageParserBase {
    static name =  'MediosPublicos.uy';
	static domainMatcher = [
		'mediospublicos.uy'
	];
	selectorsToRemove = [
		'.span-reading-time',
		'.rt-reading-time',
	];
}
