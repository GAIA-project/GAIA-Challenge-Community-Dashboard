import axios from './axios';

// @todo maybe later
/*function parseBackendValidationErrors(response) {
	const valErrors = get(response, 'data.error.validation_errors');
	if (response.status === 400 && valErrors) {
		const camelCasedErrors = mapKeys(valErrors, (value, key) =>
			snakeToCamel(key)
		);
		return mapValues(camelCasedErrors, valError => {
			return valError.map(obj => obj.code);
		});
	}
	return null;
}*/

export default class Api {
	baseUrl = null;
	defaultHeaders = {};
	
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}

	__request(method, url, data, options) {
		options || (options = {});

		const axiosOptions = {
			method,
			baseURL: this.baseUrl,
			url,
			data: method !== 'get' && data ? data : undefined,
			params: method === 'get' && data ? data : options.params,
			headers: Object.assign({
					'Content-Type': 'application/json'
				}, this.defaultHeaders),
		};

		Object.assign(axiosOptions, options);

		const xhr = axios(axiosOptions);

		// We fork the promise tree as we want to have the error traverse to the listeners
		if (this.onRequestError && options.skipRequestError !== true) {
			xhr.catch(this.onRequestError);
		}

		const onSuccess = options.skipFormatter === true
			? Promise.resolve()
			: this.__responseFormatter;
		return xhr.then(onSuccess);
	}

	__responseFormatter(response) {
		return response.data || response;
	}

	get(url, data, options) {
		return this.__request('get', url, data, options);
	}

	post(url, data, options) {
		return this.__request('post', url, data, options);
	}

	patch(url, data, options) {
		return this.__request('patch', url, data, options);
	}

	put(url, data, options) {
		return this.__request('put', url, data, options);
	}

	delete(url, data, options) {
		return this.__request('delete', url, data, options);
	}

	// @todo adjust interface methods
	buildFetchModelParams(model) {
		return {
			with: model.__activeRelations
				.map(model.toBackendAttrKey)
				.join(',') || null,
		};
	}

	fetchModel({ url, data }) {
		return this.get(url, data).then(res => {
			return {
				data: res.data,
				repos: res.with,
				relMapping: res.with_mapping,
			};
		});
	}

	saveModel({ url, data, params, isNew }) {
		const method = isNew ? 'post' : 'patch';
		return this[method](url, data, { params })
			.then(newData => {
				return { data: newData };
			})
			.catch(err => {
				/*if (err.response) {
					err.valErrors = parseBackendValidationErrors(err.response);
				}*/
				throw err;
			});
	}

	saveAllModels({ url, data }) {
		return this.put(url, {
			data: data.data,
			with: data.relations,
		}).then(res => {
			return {
				data: res.data && res.data.length > 0 ? res.data[0] : null,
				repos: res.with,
				relMapping: res.with_mapping,
			};
		});
	}

	deleteModel({ url, params }) {
		// TODO: kind of silly now, but we'll probably want better error handling soon.
		return this.delete(url, null, { params });
	}

	buildFetchStoreParams(store) {
		const offset = store.getPageOffset();
		return {
			with: store.__activeRelations.join(',') || null,
			limit: store.__state.limit,
			// Hide offset if zero so the request looks cleaner in DevTools.
			offset: offset || null,
		};
	}

	fetchStore({ url, data }) {
		return this.get(url, data).then(res => {
			return {
				data: res.data,
				repos: res.with,
				//relMapping: res.with_mapping,
				totalRecords: res.totalRecords,
			};
		});
	}
}

let instances = [];
export function getInstance(baseUrl) {
	if (!instances[baseUrl]) instances[baseUrl] = new Api(baseUrl);
	return instances[baseUrl]
}
