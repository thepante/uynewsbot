import PageParserBase from "./PageParserBase.mjs";

export default class Carasycaretascomuy extends PageParserBase {
    static name = 'Caras y Caretas';
    static domainMatcher = [
        'carasycaretas.com.uy'
    ]
    checkPaywalJSDOM(data) {
        const dom = data.window.document;
        const sel = '.entry-content .boton-comunidad a[href$="registro-socios/"]';
        return dom.querySelector(sel) != undefined;
    }
}

