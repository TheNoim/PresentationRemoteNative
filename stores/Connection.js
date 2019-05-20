import { observable, runInAction, action, computed } from 'mobx';
import io from 'socket.io-client';
import { Navigation } from 'react-native-navigation';
import { get } from 'lodash';

class ConnectionStore {
	@observable connected = false;

	@observable _presentations = [];

	@observable renderControl = true;

	@computed get presentations() {
		return this._presentations;
	}

	set presentations(v) {
		this._presentations = v;
		this.renderControl = false;
		requestAnimationFrame(() => {
			runInAction(() => {
				this.renderControl = true;
			});
		});
	}

	@observable presentation = {};

	@observable selected = false;

	@observable initialFetch = false;

	@observable pw = null;

	@computed get title() {
		return get(this.presentation, 'title', 'Willkommen');
	}

	client = null;

	connect() {
		if (!this.client) {
			this.client = io('https://remote.noim.io/');
		}
		this.registerEvents();
	}

	registerEvents() {
		this.client.on('connect', () => {
			runInAction(() => {
				this.connected = true;
			});
			this.initClient();
		});
		this.client.on('disconnect', () => {
			runInAction(() => {
				this.connected = false;
				this.initialFetch = false;
			});
		});
		this.client.on('reconnect', () => {
			// Run reconnect
			this.initClient();
			if (this.selected) {
				this.subscribeTo(this.selected);
			}
		});
		this.client.on('updateState', state => {
			runInAction(() => {
				this.presentation = state;
			});
		});
		this.client.on('destroy', () => {
			this.destroy();
		});
		this.client.on('presentationList', list => {
			runInAction(() => {
				this.presentations = list;
			});
		});
	}

	initClient() {
		this.client.emit('setType', { type: 'remote' });
		this.refreshPresentationList();
	}

	refreshPresentationList() {
		this.client.emit('listPresentations', '', data => {
			runInAction(() => {
				this.presentations = data;
				this.initialFetch = true;
			});
		});
	}

	subscribeTo(id) {
		this.client.emit(
			'subscribeTo',
			{
				password: this.password,
				id
			},
			state => {
				if (state) {
					this.setSelectedPresentation(state, id);
				} else {
					this.unselect();
				}
			}
		);
	}

	@action unselect() {
		this.selected = false;
		this.presentation = {};
	}

	@action setSelectedPresentation(state, id) {
		this.presentation = state;
		this.selected = id;
		Navigation.dismissAllModals();
	}

	@action setPassword(pw) {
		this.password = pw === '' ? null : pw;
	}

	sendAction(action) {
		this.client.emit('sendToPresentation', {
			action
		});
	}

	@action destroy() {
		this.presentation = {};
		this.selected = null;
		this.initialFetch = false;
		this.pw = null;
		this.client.disconnect();
		this.client.open();
	}
}

const connectionStore = new ConnectionStore();

export default connectionStore;
