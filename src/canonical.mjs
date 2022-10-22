import { _fetch } from './fetcher.mjs';
import buildJSDOM from "./JSDOMBuilder.mjs";

export async function getCanonicalURL(originalURL) {
    try {
		const page =  await _fetch(originalURL);
        const data = buildJSDOM(page.data);
        const dom = data.window.document;
        const newURL = dom.querySelector('[rel="canonical"]')?.attributes?.href.value;

        if (!newURL) {
            return originalURL;
        }

        new URL(newURL); //to make sure it's a parseable URL
        return newURL;
    } catch (e) {
        console.log('Error trying to get canonical', e);
        return originalURL;
    }
}
