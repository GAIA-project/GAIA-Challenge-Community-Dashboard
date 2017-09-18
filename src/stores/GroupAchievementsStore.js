import { SpineStore } from '../lib/mobx-spine';
import Achievement from './models/Achievement';

export default class GroupAchievementsStore extends SpineStore {
	Model = Achievement;
	groupId;

	constructor(groupId) {
		super();
		
		this.groupId = groupId;
	}
	
	url() {
		return `achievements/group/${this.groupId}`;
	}
}