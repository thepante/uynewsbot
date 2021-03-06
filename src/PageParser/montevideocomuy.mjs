import PageParserBase from "./PageParserBase.mjs";

export default class Montevideocomuy extends PageParserBase {
    static name =  'Montevideo Portal';
    static publisherSites = {
        'montevideo.com.uy': '',
        'pantallazo.com.uy': 'Pantallazo',
        'cartelera.com.uy': 'Cartelera',
        'gastronomia.com.uy': 'Gastronomía',
        'futbol.com.uy': 'Fútbol UY',
        'galeria.montevideo.com.uy': 'Galería',
        'airbag.uy': 'Airbag',
        'latidobeat.uy': 'Beat',
    };
    static domainMatcher = Object.keys(this.publisherSites);
    selectorsToRemove = [
        '#interes',
        '.pie_arriba',
        '.pie_abajo',
        '.autor',
        'picture + .caption',
    ]
}
