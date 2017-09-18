import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import moment from 'moment';
import __ from '../lib/i18n';

@observer
export default class Achievement extends React.Component {
	static defaultProps = {
		model: null
	};

	render() {
		const { model } = this.props;

		if(!model) return null;

		return (
			<div className={classNames('item', {locked: !model.unlocked, 'no-image': !model.image})}>
				{ model.image && <img src={model.image.url} width={model.image.width} height={model.image.height} /> }

				<div className="tooltip-content">
					<h4 className="name">{model.name}</h4>
					{ model.image && <img className="image" src={model.image.url} width={model.image.width} height={model.image.height} /> }
					{ model.content != '' && <div className="content">{model.content}</div> }
					{ model.pointsChallenge > 0 &&
						<div className="points_challenge">
							{ model.unlocked
								? __('You got {{x}} points for this badge.', {x: model.pointsChallenge})
								: __('You can get {{x}} points for this badge.', {x: model.pointsChallenge})
							}
						</div>
					}
					{ model.unlockedAt &&
						<div className="unlocked_at">
							{__('You unlocked this achievement on {{date}}.', {
								date: moment(model.unlockedAt).format('L LT')
							})}
						</div>
					}
				</div>
			</div>
		);
	}
}