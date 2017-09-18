import { SpineStore } from '../lib/mobx-spine';
import Submission from './models/Submission';

export default class GroupSubmissionsStore extends SpineStore {
	Model = Submission;
	groupId;

	constructor(groupId) {
		super();
		
		this.groupId = groupId;
	}
	
	url() {
		return `submissions/group/${this.groupId}`;
	}
}