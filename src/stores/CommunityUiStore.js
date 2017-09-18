import { observable, action } from 'mobx';

export default class CommunityUiStore {
	@observable selectedGroup;

	@action setSelectedGroup(group) {
		this.selectedGroup = group;
	}
}