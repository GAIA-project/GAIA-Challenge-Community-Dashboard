import { observable, action, runInAction } from 'mobx';
import axios from '../lib/axios';
import appConfig from '../config/config';

export default class HighScoresStore {
	groupId;
	@observable ranks = [];
	
	@observable isLoading = false;
	@observable isError = false;
	cancelRequest; // for canceling axios request
	
	constructor(groupId) {
		this.groupId = groupId;
	}
	
	@action setData(data) {
		this.ranks.replace(data);
	}
	
	@action clear() {
		this.ranks = [];
	}
	
	dispose() {
		this.cancelRequest && this.cancelRequest();
	}
	
	async fetch() {
		this.cancelRequest && this.cancelRequest();
		
		// mobx
		runInAction('load highscores - before load', () => {
			this.isLoading = true;
			this.isError = false;
		});

		try {
			let response = await axios.get(appConfig.apiBaseUrl + `/ranks/group/${this.groupId}`, {
				cancelToken: new (axios.CancelToken)(c => this.cancelRequest = c)
			});
			
			this.setData(response.data.data);
		} catch (e) {
			this.handleError(e);
		}

		runInAction('load highscores - after load', () => {
			this.isLoading = false;
		});
	}

	/**
	 * @todo: DRY
	 */
	@action handleError(error) {
		let msg = error instanceof Error ? error.message : error;
		console.log(msg, error);
		
		//toast(msg);

		this.clear();
		this.isError = true;
	}

}