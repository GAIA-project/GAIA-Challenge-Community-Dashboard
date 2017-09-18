import React from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import moment from 'moment';
import __ from '../lib/i18n';

@observer
export default class SubmissionTeaser extends React.Component {
	static defaultProps = {
		model: {},
		onClick: () => {},
	};

	render() {
		const { model } = this.props;

		return (
			<div className="item">
				<div className={classNames('inner', {'no-teaser': !model.imageTeaser})} onClick={() => { this.props.onClick(model.id) }} >
					{ model.imageTeaser
						? <div className="img-teaser" style={{backgroundImage: `url(${model.imageTeaser.url})`}}/>
						: <div className="img-no-teaser"/>
					}
	
					<h4 className="name">{model.name}</h4>
					<span className="author">{__('by')}&nbsp;{model.author}</span>
					<span className="date">{moment(model.date).format('ll')}</span>
					<span className="votes">{__('votes')}: {model.votes}</span>
					
					{ model.content && <p>{model.content}</p> }
				</div>
			</div>
		);
	}
}