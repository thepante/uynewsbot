import PageParserBase from "./PageParserBase.mjs";
import jQuery from "jquery";

export default class Elobservadorcomuy extends PageParserBase {
    static name =  'El Observador';
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
    ];
    checkPaywalJSDOM(dom) {
        const $ = jQuery(dom.window);
        let tags = $('meta[name="cXenseParse:ohs-tag"]').attr('content');
        tags += $('meta[name="cXenseParse:ohs-tiponota"]').attr('content');
        return tags.match(/member/i) != undefined;
    }
}
