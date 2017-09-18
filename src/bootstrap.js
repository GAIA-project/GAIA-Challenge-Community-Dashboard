import merge from 'lodash/merge';
import { useStrict, action } from 'mobx';
import appConfig from './config/config';

useStrict(true);

export const setConfig = action((config) => {
	merge(appConfig, config);
	return appConfig;
});