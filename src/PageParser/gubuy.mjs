import PageParserBase from "./PageParserBase.mjs";

export default class Gubuy extends PageParserBase {
  static name = 'GUB.UY';
  static publisherSites = {
      'gub.uy': '',
      'montevideo.gub.uy': 'Montevideo',
  };
  static domainMatcher = Object.keys(this.publisherSites);
  selectorsToRemove = [
    //-- gub.uy
    '.Page-info',
    'table',
    'h3',
    '.lista-documento-fecha',
    '.fecha-destacada',
    //-- montevideo.gub.uy
    '.field-name-fecha-publicacion-actualizacion',
    '.field-name-readspeaker',
    '.field-name-read_time',
    '.views-field-field-autor',
    '.views-field-field-pie-de-foto',
    '.field-name-field-dependencia-responsable',
  ];
  textsToIgnore = {
    span: [ 'detalle personas fallecidas' ],
  };
}

