import React from 'react';
import {observer} from 'mobx-react';
import __ from '../lib/i18n';
import moment from 'moment';
import {VelocityTransitionGroup} from 'velocity-react';
import $ from 'jquery';

@observer
export default class GroupAchievements extends React.Component {
	static defaultProps = {
		group: null,
		oauthApi: {
			url: 'https://sso.sparkworks.net/aa/oauth/token',
			clientId: 'gaia_challenge',
			clientSecret: '1f1283c6-20bf-45f9-9dc1-4c405c47feb3',
			grantType: 'password',
			username: 'af',
			password: 'iWuuA3p'
		},
		widgetConfig: {
			to: moment(new Date()).format("M-D-YYYY"), // requires moment js here
			from: moment(new Date()).subtract(3, 'months').format("M-D-YYYY"),
			step: 'day' // day|month|hour|5min
		}
	};

	componentWillMount() {
		this.state = {
			token: null,
			loading: true
		};

		this.initStore(this.props.group);
		this.requestAccessToken();
	}

	componentWillReceiveProps(nextProps) {
		if (typeof nextProps.group !== 'undefined' && nextProps.group !== this.props.group) {
			this.disposeStore();
			this.initStore(nextProps.group);
		}
	}

	componentDidUpdate() {
		if (!this.state.token) return;
		this.updateIframe(this.props.group.schoolSiteId, this.state.token);
	}

	componentWillUnmount() {
		this.disposeStore();
	}

	initStore(group) {
		if (!group) return;
	}

	requestAccessToken() {
		let self = this;
		$.ajax({
			type: 'POST',
			url: self.props.oauthApi.url,
			data: {
				client_id: self.props.oauthApi.clientId,
				client_secret: self.props.oauthApi.clientSecret,
				grant_type: self.props.oauthApi.grantType,
				username: self.props.oauthApi.username,
				password: self.props.oauthApi.password
			},
			success: function (oauth) {
				self.updateIframe(self.props.group.schoolSiteId, oauth.access_token);
				self.setState({
					loading: false,
					token: oauth.access_token
				});
			}
		});
	}

	updateIframe(siteId, token) {
		let url = 'http://bms.gaia-project.eu/services/#/page/chart/' + siteId + '/' + token + '/' + this.props.widgetConfig.step + '/' + this.props.widgetConfig.from + '/' + this.props.widgetConfig.to,
			$iframe = $(this.iframe);
		$iframe.attr('src', url);
	}

	disposeStore() {

	}

	render() {
		const {group} = this.props;

		if (!group) return null;

		return (
			<div className="group-sensor-data-widget">
				<div className="inner">
					<h5 className="header">{__('Sensor Data')}</h5>

					<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
						{(this.state.loading) && (
							<div className="loader"></div>
						)}
					</VelocityTransitionGroup>

					<iframe
						ref={n => this.iframe = n}
						className={'group-sensor-data'}
						key={group.schoolSiteId}
						frameBorder={'0'}
					></iframe>

				</div>
			</div>
		);
	}
}