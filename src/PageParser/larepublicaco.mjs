import PageParserBase from "./PageParserBase.mjs";

export default class Larepublicaco extends PageParserBase {
    static name =  'LaRepublica.co';
    static domainMatcher = [
        'larepublica.co'
    ]
    selectorsToRemove = [
    ];
}
