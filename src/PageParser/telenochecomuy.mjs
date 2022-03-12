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
  ];
}
