import PageParserBase from "./PageParserBase.mjs";

export default class Semanariovocescom extends PageParserBase {
    static name =  'Voces';
    static domainMatcher = [
      'semanariovoces.com'
    ]
    selectorsToRemove = [
      '.featured',
      '.sharedaddy + .code-block',
      '.sd-sharing-enabled + .code-block',
      '.sharedaddy',
      '.sd-sharing-enabled',
      '.cactus-author-post',
    ];
}
