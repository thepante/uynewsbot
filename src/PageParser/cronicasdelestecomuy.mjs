import PageParserBase from "./PageParserBase.mjs";

export default class Cronicasdelestecomuy extends PageParserBase {
    static name =  'Crónicas del Este';
    static domainMatcher = [
        'cronicasdeleste.com.uy'
    ]
    selectorsToRemove = [
		'.post_commentbox',
		'#BannerGrupo',
    ]
}
