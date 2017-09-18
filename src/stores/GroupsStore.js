import { SpineStore } from '../lib/mobx-spine';
import Group from './models/Group';

export default class GroupsStore extends SpineStore {
	url = 'groups';
	Model = Group;
}