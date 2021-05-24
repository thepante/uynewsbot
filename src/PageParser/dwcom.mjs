import PageParserBase from "./PageParserBase.mjs";

export default class Dwcom extends PageParserBase {
    static name = 'Deutsche Welle';
    static altName = 'Deutsche Welle (www.dw.com)';
    static domainMatcher = [
        'dw.com'
    ]
    selectorsToRemove = [
        '.picBox',
    ];
}


