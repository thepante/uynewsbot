import PageParserBase from "./PageParserBase.mjs";

export default class Elpaiscom extends PageParserBase {
    static name = 'ElPais.com';
    static domainMatcher = [
        'elpais.com'
    ]
    selectorsToRemove = [
      '#ctn_freemium_article',
      '[data-ctn-subscription=true]',
    ];
    checkPaywalJSDOM(data) {
        const dom = data.window.document;
        return dom.getElementById('ctn_freemium_article') != undefined;
    }
}
