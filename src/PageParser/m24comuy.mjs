import PageParserBase from "./PageParserBase.mjs";

export default class M24comuy extends PageParserBase {
  static name = 'M24';
  static altName = 'Cooperativa de Trabajo SUBTE | https://subte.uy';
  static domainMatcher = [
    'm24.com.uy'
  ]
  selectorsToRemove = [
    '.wp-embedded-content',
  ];
  textsToIgnore = {
    strong: [ 'nota relacionada:' ],
  };
}

