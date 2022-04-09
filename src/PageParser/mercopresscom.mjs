import PageParserBase from "./PageParserBase.mjs";

export default class Mercopresscom extends PageParserBase {
    static name =  'MercoPress';
    static domainMatcher = [
        'mercopress.com'
    ]
    selectorsToRemove = [
        '.content-data',
    ]
}
