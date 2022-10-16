import PageParserBase from "./PageParserBase.mjs";

export default class Dailymailcouk extends PageParserBase {
  static name =  'Daily Mail Online';
  static domainMatcher = [
    'dailymail.co.uk'
  ]
  selectorsToRemove = [
    '.mol-img-group',
    '.artSplitter',
	'#external-source-links',
	'.related-carousel',
  ];
}
