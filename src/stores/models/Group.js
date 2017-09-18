import { observable } from 'mobx';
import { SpineModel } from '../../lib/mobx-spine';

export default class Group extends SpineModel {
	@observable id;
	@observable name;
	@observable schoolName;
	@observable city;
	@observable country;
	@observable schoolSiteId;
	@observable rank;
	@observable points;
	@observable currentPlayerJoined = false;
}