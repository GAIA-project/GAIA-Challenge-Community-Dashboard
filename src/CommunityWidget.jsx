import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { setConfig } from './bootstrap';
import { init as initI18n } from './lib/i18n';

//import DevTools, {configureDevtool} from 'mobx-react-devtools';

import { GroupsStore, CommunityUiStore } from './stores';
import CommunityContainer from './components/CommunityContainer';


let groupsStore,
	uiStore;

const render = (Component, element) => {
	ReactDOM.render(
		<BrowserRouter>
			<Provider
				groupsStore={groupsStore}
				uiStore={uiStore}
			>
				<Component />
			</Provider>
		</BrowserRouter>,
		element
	);
};

export function init(options = {}) {
	initI18n(options.locale || 'de');

	if(options.config) {
		setConfig(options.config);
	}

	groupsStore = new GroupsStore();
	groupsStore.setLimit(false);
	groupsStore.fetch();
	
	uiStore = new CommunityUiStore();
	
	render(CommunityContainer, options.element);
}