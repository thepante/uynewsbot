import PageParserBase from "./PageParserBase.mjs";

export default class Elobservadorcomuy extends PageParserBase {
    static name = 'El Observador';
    static domainMatcher = [
        'elobservador.com.uy'
    ]
    selectorsToRemove = [
        '.btn--reportar-error',
        '.comentarios',
        '.contenedor__publicidad',
        '.banda--opinion',
        '.volanta_key',
        '.ultimas-noticias',
        '.tp-container-inner',
        '.loginCompra',
        '.login-cont',
        '#modalLogin',
        '.redes',
        '.opacityBody',
        '.member',
        '.tag',
        '.mensaje_paywall2',
        '.mensaje_member',
        '.boxepigrafe',
        '.epigrafe',
        '.link_a_nota_propia',
        '.nota-propia',
        '.contenedor > .volanta_key',
        '.item.tiempo',
        '.contSlider',
    ];
    checkPaywalJSDOM(data) {
        const dom = data.window.document;
        const selectors = 'meta[name="cXenseParse:ohs-tag"], meta[name="cXenseParse:ohs-tiponota"]';
        const tags = Array.from(dom.querySelectorAll(selectors)).map(node => node?.attributes?.content?.value).toString();
        return tags.match(/member/i) != undefined;
    }
}
