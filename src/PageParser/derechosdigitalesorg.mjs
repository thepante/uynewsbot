import PageParserBase from "./PageParserBase.mjs";

export default class Derechosdigitalesorg extends PageParserBase {
  static name =  'Derechos Digitales';
  static domainMatcher = [
    'derechosdigitales.org'
  ]
  selectorsToRemove = [
    '.date',
  ];
}
