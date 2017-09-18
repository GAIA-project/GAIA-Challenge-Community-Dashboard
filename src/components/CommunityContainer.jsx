import React from 'react';
import { observer, inject } from 'mobx-react';

import GroupsRanking from './GroupsRanking';
import GroupDashboard from './GroupDashboard';

@inject('uiStore') @observer
export default class CommunityContainer extends React.Component {
	render() {
		const { uiStore } = this.props;
		
		return (
			<div>
				<GroupsRanking />
				{ uiStore.selectedGroup && 
					<GroupDashboard group={uiStore.selectedGroup} />
				}
			</div>
		);
	}
}