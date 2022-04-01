import PageParserBase from "./PageParserBase.mjs";

export default class Telenochecomuy extends PageParserBase {
  static name =  'Telenoche';
  static altName = 'Canal';
  static domainMatcher = [
    'telenoche.com.uy'
  ]
  selectorsToRemove = [
    '.date',
    '.article-body__info-wrapper',
    '.type_imagen',
    '.news-stopper',
    '.recommended-news',
    '.news-headline__topic',
    '.news-topics',
    '.subscription-ad',
    '.type_videoexterno',
  ];
  textsToIgnore = {
    h2: [ 'te puede interesar' ],
  };
}
