import PageParserBase from "./PageParserBase.mjs";

export default class Busquedacomuy extends PageParserBase {
    static name = 'Búsqueda';
    static altName = 'Semanario BUSQUEDA';
    static domainMatcher = [
        'busqueda.com.uy'
    ]
    selectorsToRemove = [
        '.main-img',
        '.plan_suscriptores',
        '.item.comments',
        '.despliegue-info.align-middle',
        '.caption',
    ];
    checkPaywalJSDOM(data) {
        const dom = data.window.document;
        return dom.querySelector('.plan_suscriptores')?.textContent?.match('nota es exclusiva') != undefined;
    }
}
