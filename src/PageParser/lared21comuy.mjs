import PageParserBase from "./PageParserBase.mjs";
import jQuery from "jquery";

export default class Lared21comuy extends PageParserBase {
    static name =  'La Red 21';
    static altName = 'LARED21';
    static domainMatcher = [
        'lr21.com.uy'
    ]
    selectorsToRemove = [

    ];
}
