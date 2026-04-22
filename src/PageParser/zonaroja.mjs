import PageParserBase from "./PageParserBase.mjs";

export default class Zonaroja extends PageParserBase {
	static name =  'Zona Roja';
	static domainMatcher = [
		'zonaroja.uy'
	]
	selectorsToRemove = [
		'img, figure, video',
	];
}
