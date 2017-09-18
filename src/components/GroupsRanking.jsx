import React from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { VelocityTransitionGroup } from 'velocity-react';
import __ from '../lib/i18n';

import GroupRankPosition from './GroupRankPosition';
import NanoScroller from './NanoScroller';

@inject('groupsStore', 'uiStore') @observer
export default class GroupsRanking extends React.Component {
	
	@computed get itemsPodium () {
		const { groupsStore } = this.props;
		return groupsStore.models.filter(item => item.rank && item.rank <= 3);
	}
	
	@computed get itemsRest () {
		const { groupsStore } = this.props;
		return groupsStore.models.filter(item => item.rank > 3);
	}
	
	setSelectedGroup(group) {
		const { uiStore } = this.props;
		uiStore.setSelectedGroup(group);
	}
	
	render() {
		const { groupsStore } = this.props;
		
		return (
			<div className="group-ranking-widget">
				<div className="inner">
					<div className="group-ranking-head">
						<h1 className="title">{__('Mission team ranking')}</h1>
						<span className="info">{__('select an entry')}</span>
					</div>
					<div className="group-ranking">
						
						<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
							{ groupsStore.isLoading && 
								<div className="loader"></div>
							}
						</VelocityTransitionGroup>

						<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
							{ !groupsStore.isLoading && (
								<div>
									<NanoScroller
										className="list-podium"
										contentTag="ul"
										contentProps={{className: 'content'}}
										onComponentDidMount={scrollListToOwnPosition}
									>
										{ this.itemsPodium.map(group => <GroupRankPosition group={group} key={group.id} onClick={() => this.setSelectedGroup(group)} />) }
									</NanoScroller>
								
									{ this.itemsRest.length > 0 && (
										<div>
											<div className="list-separator"></div>
											<NanoScroller
												className="list with-separator"
												contentTag="ul"
												contentProps={{className: 'content'}}
												onComponentDidMount={scrollListToOwnPosition}
											>
												{ this.itemsRest.map(group => <GroupRankPosition group={group} key={group.id} onClick={() => this.setSelectedGroup(group)} />) }
											</NanoScroller>
										</div>
									) }
								</div>
							) }
						</VelocityTransitionGroup>
						
					</div>
				</div>
			</div>
		);
	}
}

export function scrollListToOwnPosition(scrollList) {
	let $list = scrollList.$scrollContainer,

		$items = $list.find('.item'),
		$itemOwn = $list.find('.item.own').first(),
		hasOwn = !!$itemOwn.length,
		ownPositionTop = null,
		itemsCount = $items.length,

		listHeight = $list.height(),
		itemHeight = $items.first().height(),
		itemsHeight = itemsCount * itemHeight,

		middleHeight = (itemsHeight / 2),
		middleTopScroll = ((itemsHeight - listHeight) / 2) + (itemHeight / 2),

		isLower = null,
		isUpper = null,

		scrollTop = null;

	if (hasOwn) {
		ownPositionTop = $itemOwn.position().top;

		if (ownPositionTop < middleHeight - itemHeight) {
			isLower = true;
			isUpper = false;
		} else if (ownPositionTop > middleHeight - itemHeight) {
			isLower = false;
			isUpper = true;
		}

		if (isLower || isUpper) {
			scrollTop = ownPositionTop - (listHeight / 2) + (itemHeight / 2);
		} else {
			scrollTop = middleTopScroll;
		}
	} 	else {
		scrollTop = 0;
	}

	$list.nanoScroller({ scrollTop: scrollTop });
};
