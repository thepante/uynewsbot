import Bbccom from './bbccom.mjs';
import Brechacomuy from './brechacomuy.mjs';
import Busquedacomuy from './busquedacomuy.mjs';
import Carasycaretascomuy from './carasycaretascomuy.mjs';
import Carve850comuy from './carve850comuy.mjs';
import Cientoochentacomuy from './180comuy.mjs';
import Diariocambiocomuy from './diariocambiocomuy.mjs';
import Dwcom from './dwcom.mjs';
import Efecom from './efecom.mjs';
import Elcascotenewscom from "./elcascotenewscom.mjs";
import Elobservadorcomuy from './elobservadorcomuy.mjs';
import Elpaiscomuy from './elpaiscomuy.mjs';
import Gubuy from './gubuy.mjs';
import Infobaecom from './infobaecom.mjs';
import Ladiariacomuy from './ladiariacomuy.mjs';
import Lamananacomuy from "./lamananacomuy.mjs";
import Lanacioncomar from './lanacioncomar.mjs';
import Lared21comuy from "./lared21comuy.mjs";
import Larepublicacomuy from "./larepublicacomuy.mjs";
import M24comuy from './m24comuy.mjs';
import Montevideocomuy from './montevideocomuy.mjs';
import PageParserBase from "./PageParserBase.mjs";
import Subrayadocomuy from "./subrayadocomuy.mjs";
import Teledocecomuy from "./teledocecomuy.mjs";
import Telenochecomuy from './telenochecomuy.mjs';
import _ from 'lodash';
import {getCanonicalURL} from "../canonical.mjs";


export default async function parsePage(url) {
    const processors = [
        Bbccom,
        Brechacomuy,
        Busquedacomuy,
        Carasycaretascomuy,
        Carve850comuy,
        Cientoochentacomuy,
        Diariocambiocomuy,
        Dwcom,
        Efecom,
        Elcascotenewscom,
        Elobservadorcomuy,
        Elpaiscomuy,
        Gubuy,
        Infobaecom,
        Ladiariacomuy,
        Lamananacomuy,
        Lanacioncomar,
        Lared21comuy,
        Larepublicacomuy,
        M24comuy,
        Montevideocomuy,
        Subrayadocomuy,
        Teledocecomuy,
        Telenochecomuy,
    ];

    const ProcessorClasses = _.filter(processors, function(p) {
        return p.match(url);
    });

    const ProcessorClass = _.first(ProcessorClasses);
    if (!ProcessorClass) {
        return PageParserBase.createError('No domain matches');
    }

    const finalUrl = await getCanonicalURL(url);
    if (url !== finalUrl) {
        console.log('--------');
        console.log(' ↯ Canonicalizing:');
        console.log(` O ⇢ ${url}`);
        console.log(` N ⇢ ${finalUrl}`);
        console.log('--------');
    }

    return new ProcessorClass(finalUrl).fetch();
}
