import axios from 'axios';

const UA = [
	'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/80.2.3.5 Safari/537.36',
	'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible;) Chrome/80.2.3.5 Safari/537.36',
	'Mozilla/ 5.0(iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit / 605.1.15(KHTML, like Gecko) CriOS / 111.0.5563.72 Mobile / 15E148 Safari / 604.1;',
	'Mozilla / 5.0(Linux; Android 10) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 111.0.5563.57 Mobile Safari / 537.36;',
	'Mozilla / 5.0(iPad; CPU OS 16_3 like Mac OS X) AppleWebKit / 605.1.15(KHTML, like Gecko) CriOS / 111.0.5563.72 Mobile / 15E148 Safari / 604.1;',
];

const preferredUA = {};
const retries = UA.length-1;

export async function _fetch(url) {
	const { hostname } = new URL(url);
	let iUA = 0;

	axios.interceptors.response.use(
		async (resp) => {
			if (iUA > 0 && preferredUA[hostname] === undefined) {
				preferredUA[hostname] = iUA;

				if (process.env.NODE_ENV === 'dev')
					console.debug({ hostname, index: iUA, url });
			}
			return resp;
		},
		async (err) => {
			const { status, config, message  } = err;

			if (!config || !config.retry)
				return Promise.reject(err);

			iUA = retries - config.retry;
			config.headers = { 'user-agent': UA[preferredUA[hostname] !== undefined ? preferredUA[hostname] : iUA] };
			config.retry -= 1;

			const delayRetryRequest = new Promise(resolve => {
				setTimeout(() => resolve(), (config.retryDelay || 1000));
			});
			return delayRetryRequest.then(() => axios(config));
		}
	);

	return axios.get(url, {
		retry: retries, retryDelay: 2000, headers: {
			'user-agent': UA[0],
		},
	});
}
