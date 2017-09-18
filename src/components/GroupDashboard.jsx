import React from 'react';

import GroupPlayersRanking from './GroupPlayersRanking';
import GroupAchievements from './GroupAchievements';
import GroupSubmissions from './GroupSubmissions';
import GroupSensorData from './GroupSensorData';

export default class GroupDashboard extends React.Component {
	render() {
		const { group } = this.props;
		
		if(!group) return null;

		const details = [group.city, group.country].filter(x => !!x);
		
		return (
			<div className="group-dashboard-widget">
				<div className="group-dashboard-head">
					<span className="rank">{group.rank}</span>
					<h1 className="name">{group.name} {group.schoolName}</h1>
					{ details.length > 0 && (
						<h2 className="details">{ details.join(', ') }</h2>
					) }
				</div>
				<div className="group-dashboard">
					<GroupAchievements group={group} />
					<GroupPlayersRanking group={group} />
					<GroupSensorData group={group} />
					<GroupSubmissions group={group} />
				</div>
			</div>
		);
	}
}