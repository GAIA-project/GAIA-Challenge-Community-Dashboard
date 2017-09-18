import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

@observer
export default class PlayerRankPosition extends React.Component {
	static defaultProps = {
		player: {}
	};
	
	render() {
		const { player } = this.props;
		
		return (
			<li className={classNames('item', {own: player.own, internal: player.internal})}>
				<span className="rank">{player.rank}.</span>
				<span className="name">{player.name}</span>
				<span className="points">{player.points}</span>
			</li>
		);
	}
}