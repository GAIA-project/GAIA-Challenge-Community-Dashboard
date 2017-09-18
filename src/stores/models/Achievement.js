import { observable } from 'mobx';
import { SpineModel } from '../../lib/mobx-spine';

export default class Achievement extends SpineModel {
	@observable id;
	@observable name;
	@observable content;
	@observable pointsChallenge;
	@observable image;
	@observable unlocked = false;
	@observable unlockedAt;
	@observable notified = false;
}