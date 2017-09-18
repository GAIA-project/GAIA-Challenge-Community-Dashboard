import i18n from 'i18next';
import omit from 'lodash/omit';
import { observable, autorun, action } from 'mobx';
import moment from 'moment';
// polyfill for ES Intl
//import intl from 'intl';
//import 'intl/locale-data/jsonp/en.js';
//import 'intl/locale-data/jsonp/de.js';

export const i18nState = {
	@observable initialized: false,
	@observable locale: 'en'
};

export const init = action((newNocale) => {
	if (newNocale) {
		i18nState.locale = newNocale;
	}
	
	let context = require.context('../translations', false, /\.po$/);
	let resources = {};
	context.keys().forEach(function (key) {
		let locale = key.replace(/(^\.\/|\.po$)/g, ''); // get filename without extension as key
		resources[locale] = {
			translation: context(key)
		};
	});

	i18n.init({
		nsSeparator: false,
		keySeparator: false,
		fallbackNS: 'translation',
		lng: i18nState.locale,
		resources: resources,
		debug: false,
		interpolation: {
		 	escapeValue: false // not needed for react!!
		}
	});
	
	moment.locale(i18nState.locale);
	
	i18nState.initialized = true;
});

/**
 * Translate string
 *
 * @param string
 * @param options Array of following options:
 *  - count - number for pluralization
 *  - ...
 */
export const __ = function () {
	if (!i18n.translator) {
		throw new Error('i18next is not initialized yet.')
	}
	return i18n.t.apply(i18n, arguments);
};

/**
 * Translate plural string
 *
 * @param singular
 * @param plural
 * @param options Array of following options:
 *  - count - number for pluralization
 *  - ...
 */
export const _n = function (singular, plural, options) {
	options = options || {};
	options.defaultValue = singular;
	let res = i18n.t(singular, options);
	if (options.count !== 1 && (res === singular || res === i18n.services.interpolator.interpolate(singular, options)
		|| res === i18n.t(singular, omit(options, 'count')))) {
		res = i18n.services.interpolator.interpolate(plural, options);
	}
	return res;
};

export function onReadyI18n(fn) {
	autorun(() => {
		if(!i18nState.initialized) return;
		fn();
	});
}

export function getLocale() {
	return i18nState.locale;
}

/*export function priceFormat(value) {
	if(value === null) {
		return '';
	}
	
	value = value / 100;
	return new intl.NumberFormat(getLocale(), {
		style: 'currency',
		currency: 'EUR'
	}).format(value);
}*/

export default __;
export {i18n};