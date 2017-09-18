import { Model, Store } from 'mobx-spine';
import { getInstance as getApiInstance } from './Api';
import appConfig from '../config/config';

export class SpineModel extends Model {
	constructor() {
		super();
		if(!this.api) this.api = getApiInstance(appConfig.apiBaseUrl);
	}
}

export class SpineStore extends Store {
	limit = null;
	
	constructor() {
		super();
		if(!this.api) this.api = getApiInstance(appConfig.apiBaseUrl);
	}
}