import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import __ from '../lib/i18n';

import { GroupAchievementsStore } from '../stores';
import { VelocityTransitionGroup } from 'velocity-react';
import Achievement from "./Achievement";

import $ from 'jquery';

@observer
export default class GroupAchievements extends React.Component {
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
	
	componentDidMount() {
		let $el = $(ReactDOM.findDOMNode(this));
		$el.on('mouseenter touchstart', '.item', function(event){
			if($(this).hasClass('qtip-prevent-open')) return;

			$(this).qtip({
				// overwrite: false, // Make sure the tooltip won't be overridden once created
				position: {
					my: 'top center',
					at: 'bottom center',
					adjust: { y: -25 }
				},
				content: {
					text: function(event, api) {
						return $(this).children('.tooltip-content').html();
					}
				},
				style: {
					classes: 'tooltip-achievement',
					tip: {
						corner: true,
						mimic: 'top center',
						width: 14,
						height: 8,
						offset: 0
					}
				},
				show: {
					ready: true,
					solo: true
				},
				hide: {
					event: 'unfocus mouseleave'
				},
				events: {
					hidden: function(event, api) {
						// prevent instant reopen of the tooltip, if the element is still hovered
						var target = api.target;
						target.addClass('qtip-prevent-open');
						setTimeout(function(){
							target.removeClass('qtip-prevent-open');
						}, 5);

						api.destroy(true);
					}
				}
			}, event);
		});
	}

	initStore(group) {
		if (!group) return;

		this.achievements = new GroupAchievementsStore(group.id);
		this.achievements.setLimit(false);
		this.achievements.fetch();
	}

	disposeStore() {
		//this.achievements && this.achievements.dispose();
		delete this.achievements;
	}
	
	render() {
		const { group } = this.props;

		if(!group || !this.achievements) return null;

		return (
			<div className="group-achievements-widget">
				<div className="inner">
					<h5 className="header">{__('Achievements')}</h5>
					
					<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
						{ this.achievements.isLoading &&
							<div className="loader"></div>
						}
					</VelocityTransitionGroup>

					<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
						{ !this.achievements.isLoading && (
							<ul className="list" key={group.id}>
								{ this.achievements.models.map(model => <Achievement model={model} key={model.id} />) }
							</ul>
						) }
					</VelocityTransitionGroup>
				</div>
			</div>
		);
	}
}