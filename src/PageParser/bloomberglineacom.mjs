import PageParserBase from "./PageParserBase.mjs";

export default class Bloomberglineacom extends PageParserBase {
    static name =  'Bloomberg Línea';
    static domainMatcher = [
        'bloomberglinea.com'
    ]
    selectorsToRemove = [
    ];
}
