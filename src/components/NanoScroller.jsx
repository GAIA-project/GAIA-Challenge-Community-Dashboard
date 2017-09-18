import React from 'react';
import ReactDOM from 'react-dom';
// happily assuming that nanoScroller is already loaded
//import nanoScroller from 'nanoscroller';
import $ from 'jquery';

export default class NanoScroller extends React.Component {
	static defaultProps = {
		contentTag: 'div',
		contentProps: {},
		onComponentDidMount: () => {},
	};
	
	componentDidMount() {
		this.$scrollContainer = $(ReactDOM.findDOMNode(this.scrollContainer));
		this.$scrollContainer.nanoScroller();
		this.props.onComponentDidMount(this);
	}

	componentDidUpdate() {
		this.$scrollContainer.nanoScroller();
	}

	componentWillUnmount() {
		this.$scrollContainer.nanoScroller({destroy: true});
	}

	render() {
		let {
			contentTag: ContentTag,
			contentProps,
			onComponentDidMount,
			...props
		} = this.props;
		
		props.className = 'nano ' + (props.className || '');
		contentProps.className = 'nano-content ' + (contentProps.className || '');
		
		return (
			<div ref={(el) => { this.scrollContainer = el; }} {...props}>
				<ContentTag {...contentProps}>
					{this.props.children}
				</ContentTag>
			</div>
		)
	}
}