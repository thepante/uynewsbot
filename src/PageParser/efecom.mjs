import PageParserBase from "./PageParserBase.mjs";

export default class Efecom extends PageParserBase {
  static name =  'EFE';
  static domainMatcher = [
    'efe.com'
  ]
}
