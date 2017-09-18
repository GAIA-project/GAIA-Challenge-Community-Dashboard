import React from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import __ from '../lib/i18n';

import { GroupSubmissionsStore } from '../stores';
import { VelocityTransitionGroup } from 'velocity-react';
import SubmissionTeaser from './SubmissionTeaser';
import autobind from 'autobind-decorator';
import isFunction from "lodash/isFunction";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";
import $ from 'jquery';

@observer
export default class GroupSubmissions extends React.Component {
	static defaultProps = {
		group: null,
		masonryLayoutOptions: { enterTimeout: 200, leaveTimeout: 500 },
		masonryOptions: cloneDeep(Site.Theme.Submissions.Overview.MasonryOptions),
	};
	
	@observable submissions;

	componentWillMount() {
		this.initStore(this.props.group);
		this.state = {
			filterQuery: '',
			filterPortfolios: false,
			filterSnapshots: false,
			submissionsList: [],
			loading: false,
			hasMore: true
		};
	}

	componentWillReceiveProps(nextProps) {
		if(typeof nextProps.group !== 'undefined' && nextProps.group !== this.props.group) {
			this.disposeStore();
			this.initStore(nextProps.group);
		}
	}
	
	componentDidMount() {
		this.$itemsEl = $(this.itemsWrap).find('.items');
		this.setupMasonry();
	}
	
	componentDidUpdate() {
		let timeout = (this.lastItemCount < this.itemCount) ? this.props.masonryLayoutOptions.enterTimeout : this.props.masonryLayoutOptions.leaveTimeout;
		this.layoutMasonry(true, timeout);
	}

	componentWillUnmount() {
		this.disposeStore();
	}
	
	@action initStore(group) {
		if (!group) return;
		let self = this;

		this.setState({
			loading: true,
			hasMore: true
		});

		this.submissions = new GroupSubmissionsStore(group.id);
		this.submissions.setLimit(16);
		this.submissions.fetch().then(function () {
			self.setState({
				submissionsList: self.submissions.models.splice(0),
				loading: false,
				hasMore: self.submissions.hasNextPage
			});
		});
	}
	
	setupMasonry() {
		if(isFunction(this.props.masonryOptions.columnWidth)) {
			this.props.masonryOptions.columnWidth = this.props.masonryOptions.columnWidth($(this.itemsWrap));
		}

		var masonry = new Masonry(this.$itemsEl.get(0), this.props.masonryOptions);
		this.masonry = masonry;
	}

	layoutMasonry(reload, timeout) {
		if(this.debounced && this.debouncePending) {
			this.debounced.cancel();
			this.debouncePending = false;
			timeout = this.props.masonryLayoutOptions.leaveTimeout;
		}
		
		var self = this;		
		this.debounced = debounce(function(reload) {
			if(typeof self.masonry !== 'undefined') {
				if(reload) {
					self.masonry.reloadItems();
				}
				self.masonry.layout();
			}
			self.debouncePending = false;
		}, timeout);
		this.debounced(reload);
		this.debouncePending = true;
	}

	disposeStore() {
		// this.submissions && this.submissions.dispose();
	}
	
	@computed get items() {
		if(!this.state.submissionsList) {
			return [];
		}

		let submissionsFiltered = this.state.submissionsList;
		this.lastItemCount = this.itemCount;
		
		if(this.state.filterPortfolios) {
			submissionsFiltered = submissionsFiltered.filter(s => s.type === 'portfolio');
		}
		if(this.state.filterSnapshots) {
			submissionsFiltered = submissionsFiltered.filter(s => s.type === 'snapshot');
		}
		if(this.state.filterQuery) {
			submissionsFiltered = submissionsFiltered.filter((s) => { 
				let query = this.state.filterQuery.toLowerCase();
				return s.name.toLowerCase().indexOf(query) !== -1 || s.author.toLowerCase().indexOf(query) !== -1;
			});
		}
		this.itemCount = submissionsFiltered.length;
		
		return submissionsFiltered;
	}

	@autobind showSubmissionItem(id) {
		window.location.hash = '#!/portfolio-' + id;
	};

	@autobind unsetTypeFilters() {
		this.setState({
			filterSnapshots: false,
			filterPortfolios: false
		});
	}

	@autobind toggleFilterPortfolio() {
		this.setState({
			filterSnapshots: false,
			filterPortfolios: true
		});
	};

	@autobind toggleFilterSnapshots() {
		this.setState({
			filterSnapshots: true,
			filterPortfolios: false
		});
	};

	@autobind onSearchInputChange(e) {
		this.setState({
			filterQuery: e.target.value
		});
	}
	
	@autobind onSearchInputKeyDown(e) {
		// prevent form submit on Enter key
		if(e.key == 13 || e.which == 13) {
			e.preventDefault();
		}
	}

	// TODO: trigger on scroll to bottom of page?
	@autobind onLoadMore() {
		let self = this;
		if (this.submissions.hasNextPage) {
			self.setState({
				loading: true,
				hasMore: true
			});
			this.submissions.getNextPage().then(function () {
				self.state.submissionsList.push(...self.submissions.models.splice(0));
				self.setState({
					submissionsList: self.state.submissionsList,
					loading: false,
					hasMore: self.submissions.hasNextPage
				});
			});
		} else {
			self.setState({
				loading: false,
				hasMore: false
			});
		}
	}
	
	render() {
		const { group } = this.props;
		if(!group || !this.submissions) return null;

		return (
			<div className="submissions-widget">
				<section className="submissions submissions-overview">
					<header>
						<h2>{__('Submissions')}</h2>
					</header>
	
					<div className="top-container">
						<div className="filters-wrap">
							<div className="filters">
								<button className={"btn btn-filter" + ((!this.state.filterSnapshots && !this.state.filterPortfolios) ? ' active' : '')} onClick={this.unsetTypeFilters}>{__('All')}</button>
								<button className={"btn btn-filter" + (this.state.filterSnapshots ? ' active': '')} onClick={this.toggleFilterSnapshots}>{__('Snapshots')}</button>
								<button className={"btn btn-filter" + (this.state.filterPortfolios ? ' active' : '')} onClick={this.toggleFilterPortfolio}>{__('Portfolios')}</button>
							</div>
						</div>
						
						<div className="search-wrap">
							<form role="search">
								<div className="input-group">
									<input type="search" className="form-control search" placeholder={__('Search')} value={this.state.filterQuery} onChange={this.onSearchInputChange} onKeyPress={this.onSearchInputKeyDown} name="search" autoComplete="off" />
									<i className="ss-icon ss-search"></i>
								</div>
							</form>
						</div>
					</div>

					<div className="items-wrap" ref={(el) => { this.itemsWrap = el; }}>
						<div className="grid-sizer"></div>
						<ul className="items">
							<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
							{ this.items.map(item => <SubmissionTeaser model={item} key={item.id} onClick={this.showSubmissionItem} />) }
							</VelocityTransitionGroup>
						</ul>
					</div>
					
					<div className="messages-container">
						<VelocityTransitionGroup enter="fadeIn" leave="fadeOut">
							{(this.submissions.isLoading || this.state.loading) && (
								<div className="loader"></div>
							)}
							
							{(!this.submissions.isLoading && !this.state.loading && !this.items.length) && (
								<div className="messages messages-info">
									<div className="message message-info">
										{__('No results. Try a different filter or change Mission Team.')}
									</div>
								</div>
							)}
							{(!this.submissions.isLoading && !this.state.loading && this.state.hasMore) && (
								<button onClick={this.onLoadMore} className="btn btn-more">{__('load more...')}</button>
							)}
						</VelocityTransitionGroup>
					</div>
					
				</section>
			</div>
		);
	}
}