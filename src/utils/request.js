import store from '../redux/store';
const headers = new Headers({
	Accept: 'acceptcation/json',
	'Content-Type': 'application/json'
});

const HOST = 'http://127.0.0.1:3000';
let userId = 0;
function handleParams(url, params) {
	url = HOST + url;
	if (params) {
		if (store.getState().trip.user) {
			userId = store.getState().trip.user.userId;
		}
		console.log('userId', userId);

		url += '?';
		params.userId = userId;
		let paramsArr = [];
		Object.keys(params).forEach((key) => {
			paramsArr.push(`${key}=${params[key]}`);
		});
		url = url + paramsArr.join('&');
	}

	return url;
}

function handleRequest(url, res) {
	if (res.status === 200) {
		return res.json().then((data) => {
			if (data.code == 200) {
				return data;
			} else {
				return Promise.reject({ err: data });
			}
		});
	} else {
		console.error(`Request failed. URL = ${url}`);
		return Promise.reject({ err: { message: 'Request failed due to server error' } });
	}
}

export function get(url, params) {
	url = handleParams(url, params);
	return fetch(url, {
		method: 'GET',
		headers: headers,
		mode: 'cors'
	})
		.then((res) => {
			return handleRequest(url, res);
		})
		.catch((err) => {
			console.error(`Request failed. URL = ${url}.Message=${err}`);
			return Promise.reject({ err: { message: 'Request failed.' } });
		});
}

export function post(url, params) {
	url = handleParams(url);
	return fetch(url, {
		method: 'POST',
		headers: headers,
		mode: 'cors',
		body: JSON.stringify(params)
	})
		.then((res) => {
			return handleRequest(url, res);
		})
		.catch((err) => {
			console.error(`Request failed. URL = ${url}.Message=${err}`);
			return Promise.reject({ err: { message: 'Request failed.' } });
		});
}

export default get;
