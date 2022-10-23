import axios from 'axios';

const retries = 3;

const ua = {
	main: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/80.2.3.5 Safari/537.36',
	alt: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible;) Chrome/80.2.3.5 Safari/537.36',
};

export async function _fetch(url) {
	axios.interceptors.response.use(undefined, async (err) => {
		const { status, config, message } = err;

		if (!config || !config.retry)
			return Promise.reject(err);

		config.headers = { 'user-agent': ua.alt };
		config.retry -= 1;

		const delayRetryRequest = new Promise(resolve => {
			setTimeout(() => {
				console.log('Retry request', config.status, config.retry, config.headers, config.url);
				resolve();
			}, config.retryDelay || 1000);
		});
		return delayRetryRequest.then(() => axios(config));
	});

	return axios.get(url, {
		retry: retries, retryDelay: 2000, headers: {
			'user-agent': ua.main,
		},
	});
}
