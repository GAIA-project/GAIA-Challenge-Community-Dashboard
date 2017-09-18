import React from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';

@inject('uiStore') @observer
export default class GroupRankPosition extends React.Component {
	static defaultProps = {
		group: {},
		onClick: () => {},
	};
	
	render() {
		const { group, uiStore } = this.props;
		
		const schoolInfo = [group.schoolName, group.city].filter(x => !!x);
		
		return (
			<li className={classNames('item', {own: group.currentPlayerJoined, selected: uiStore.selectedGroup === group})}
				onClick={this.props.onClick}
			>
				<span className="rank">{group.rank}.</span>
				<span className="group-name">{group.name}</span>
				{ schoolInfo.length > 0 && (
					<span className="school-info">{ schoolInfo.join(', ') }</span>
				) }
				<span className="points">{group.points}</span>
			</li>
		);
	}
}