import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { VelocityTransitionGroup } from 'velocity-react';
import __ from '../lib/i18n';

import { HighScoresStore } from '../stores';
import PlayerRankPosition from './PlayerRankPosition';
import NanoScroller from './NanoScroller';
import { scrollListToOwnPosition } from './GroupsRanking';

@observer
export default class GroupsRanking extends React.Component {
	static defaultProps = {
		group: null
	};
	
	componentWillMount() {
		this.initStore(this.props.group);
	}
	
	componentWillReceiveProps(nextProps) {
		if(typeof nextProps.group !== 'undefined' && nextProps.group !== this.props.group) {
			this.disposeStore();
			this.initStore(nextProps.group);
		}
	}

	componentWillUnmount() {
		this.disposeStore();
	}

	initStore(group) {
		if (!group) return;
		
		// HighScoresStore is not mobx-spine, no need to (un)set limit 
		this.highScores = new HighScoresStore(group.id);
		this.highScores.fetch();
	}
	
	disposeStore() {
		this.highScores && this.highScores.dispose();
		delete this.highScores;
	}

	@computed get itemsPodium () {
		return this.highScores.ranks.filter(item => item.rank && item.rank <= 3);
	}

	@computed get itemsRest () {
		return this.highScores.ranks.filter(item => item.rank > 3);
	}
	
	render() {
		if (!this.highScores) return null;
		
		return (
			<div className="group-user-ranking-widget">
				<div className="inner">

					<h5 className="header">{__('Highscore')}</h5>					
					
					<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
						{ this.highScores.isLoading && 
							<div className="loader"></div>
						}
					</VelocityTransitionGroup>

					<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
						{/* need to use different keys for different result sets, as VelocityTransitionGroup
							would not run enter animation again in case the component is updated
							while being transitioned out */}
						 
						{ !this.highScores.isLoading ? (
							<div key={this.highScores.groupId}>
								<NanoScroller
									className="list-podium"
									contentTag="ul"
									contentProps={{className: 'content'}}
									onComponentDidMount={scrollListToOwnPosition}
								>
									{ this.itemsPodium.map((item, index) => <PlayerRankPosition player={item} key={index} />) }
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
											{ this.itemsRest.map((item, index) => <PlayerRankPosition player={item} key={index} />) }
										</NanoScroller>
									</div>
								) }
							</div>
						) : null }
					</VelocityTransitionGroup>
					
				</div>
			</div>
		);
	}
}