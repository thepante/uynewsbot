import PageParserBase from "./PageParserBase.mjs";

export default class Gubuy extends PageParserBase {
  static name = 'Gobierno del Uruguay';
  static domainMatcher = [
    'gub.uy'
  ]
  selectorsToRemove = [
    '.Page-info',
    'table',
    'h3',
    '.lista-documento-fecha',
    '.fecha-destacada',
  ];
  textsToIgnore = {
    span: [ 'detalle personas fallecidas' ],
  };
}

