import PageParserBase from "./PageParserBase.mjs";

export default class Elpitazonet extends PageParserBase {
	static name = 'El Pitazo';
	static domainMatcher = [
		'elpitazo.net'
	];
	selectorsToRemove = [
		'.btn--reportar-error',
		'.auxiliar_en_redirect',
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
		'footer, .footer',
	];
	checkPaywalJSDOM(data) {
		const dom = data.window.document;
		return dom.querySelectorAll('.member_container, .member_container_int').length > 0;
	}
}
