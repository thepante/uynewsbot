import PageParserBase from "./PageParserBase.mjs";

export default class Zonarojauy extends PageParserBase {
	static name =  'Zona Roja';
	static domainMatcher = [
		'zonaroja.uy'
	]
	selectorsToRemove = [
		'img, figure, video',
	];
}
