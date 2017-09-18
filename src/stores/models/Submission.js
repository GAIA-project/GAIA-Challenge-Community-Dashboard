import { observable } from 'mobx';
import { SpineModel } from '../../lib/mobx-spine';

export default class Submission extends SpineModel {
	@observable id;
	@observable name;
	@observable date;
	@observable author;
	@observable authorAvatar;
	@observable salutation;
	@observable imageTeaser;
	@observable votes;
	@observable type;
}