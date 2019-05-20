import React, { Component } from 'react';
import ConnectionStore from '../stores/Connection';
import {
	Title,
	Row,
	View,
	Icon,
	Image,
	ListView,
	Subtitle,
	Text,
	Button,
	Touchable,
	SimpleHtml
} from '@shoutem/ui';
import { observer } from 'mobx-react/custom';
import { get } from 'lodash';
import { computed } from 'mobx';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import GestureRecognizer, {
	swipeDirections
} from 'react-native-swipe-gestures';

@observer
export default class Selected extends Component {
	@computed get presentation() {
		return ConnectionStore.presentation;
	}

	@computed get currentPage() {
		if (!this.presentation) return '0';
		const hor = this.presentation.indices.h + 1;
		const vert = this.presentation.indices.v;
		let page = `${hor}`;
		if (vert !== 0) page += `.${vert + 1}`;
		return page;
	}

	@computed get notes() {
		const html = get(this.presentation, 'notes', '<div></div>');
		if (html) {
			return html;
		} else {
			return '<div></div>';
		}
	}

	render() {
		const title = get(this.presentation, 'slideTitle', 'Kein Title');
		const total = get(this.presentation, 'total', 0);

		return (
			<View flex={1}>
				<GestureRecognizer
					style={{ flex: 1 }}
					onSwipe={this.onSwipe.bind(this)}
				>
					<View style={{ padding: 16 }}>
						<Title>{title}</Title>
						<Text>
							Slide: {this.currentPage}/{total}
						</Text>
						<Row>
							<View>
								<Button
									onPress={() =>
										this.onSwipe(
											swipeDirections.SWIPE_RIGHT
										)
									}
								>
									<Text>Prev</Text>
								</Button>
							</View>
							<View>
								<Button
									styleName="secondary"
									onPress={() =>
										this.onSwipe(swipeDirections.SWIPE_LEFT)
									}
								>
									<Text>Next</Text>
								</Button>
							</View>
						</Row>
						<Title>Notes:</Title>
					</View>
					<View>
						<SimpleHtml
							customHandleLinkPress={this.openLink.bind(this)}
							body={this.notes}
						/>
					</View>
				</GestureRecognizer>
			</View>
		);
	}

	onSwipe(direction) {
		const {
			SWIPE_UP,
			SWIPE_DOWN,
			SWIPE_LEFT,
			SWIPE_RIGHT
		} = swipeDirections;
		switch (direction) {
			case SWIPE_UP:
				ConnectionStore.sendAction('down');
				break;
			case SWIPE_DOWN:
				ConnectionStore.sendAction('up');
				break;
			case SWIPE_LEFT:
				ConnectionStore.sendAction('next');
				break;
			case SWIPE_RIGHT:
				ConnectionStore.sendAction('prev');
				break;
		}
	}

	async openLink(url) {
		try {
			if (await InAppBrowser.isAvailable()) {
				await InAppBrowser.open(url, {
					// iOS Properties
					dismissButtonStyle: 'cancel',
					preferredBarTintColor: 'gray',
					preferredControlTintColor: 'white',
					readerMode: false,
					// Android Properties
					showTitle: true,
					toolbarColor: '#6200EE',
					secondaryToolbarColor: 'black',
					enableUrlBarHiding: true,
					enableDefaultShare: true,
					forceCloseOnRedirection: false,
					// Specify full animation resource identifier(package:anim/name)
					// or only resource name(in case of animation bundled with app).
					animations: {
						startEnter: 'slide_in_right',
						startExit: 'slide_out_left',
						endEnter: 'slide_in_left',
						endExit: 'slide_out_right'
					}
				});
			} else Linking.openURL(url);
		} catch (error) {}
	}
}
