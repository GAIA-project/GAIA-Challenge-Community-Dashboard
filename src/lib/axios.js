import axios from 'axios';
import ResponseError from './responseError';
export {default as ResponseError} from './responseError';
import __ from './i18n';

// axios has csrf protection built-in, just change the global defaults
axios.defaults.xsrfCookieName = '__csrf_token';
axios.defaults.xsrfHeaderName = 'X-CSRF-Token';

axios.interceptors.response.use(function (response) {
	// success
	if (typeof response.data.success !== 'undefined' && !response.data.success) {
		// 200 OK but success = false in the response...
		return Promise.reject(new ResponseError(response.data.error || __('An error has occurred.'), response.data));
	}
	
	return response;
}, function (error) {
	// error
	let { request, response = {} } = error;

	if(axios.isCancel(error)) {
		return Promise.resolve({data: []});
	}
	
	// this is how it is supposed to work:
	// if(request.statusText && request.statusText == 'abort') { 
	// but firefox is too stupid to understand it properly (check: aborted request on page refresh, statusText = 'error' in firefox)
	if(!request.readyState && !request.status && request.statusText !== 'timeout'
		&& error.code !== 'ECONNABORTED' // axios-specific check for timeout
	) {
		return Promise.resolve({data: []});
	}
	
	return Promise.reject(new ResponseError(error.message, response.data));
});

export default axios;
