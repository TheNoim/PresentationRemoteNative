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
	Touchable
} from '@shoutem/ui';
import { observer } from 'mobx-react/custom';
import { get } from 'lodash';
import { Navigation } from 'react-native-navigation';

@observer
export default class PresentationList extends Component {
	render() {
		return (
			<View flex={1}>
				<ListView
					flex={1}
					data={ConnectionStore.presentations}
					renderRow={this.renderRow.bind(this)}
					renderFooter={this.renderFooter.bind(this)}
				/>
			</View>
		);
	}

	renderFooter() {
		return (
			<View styleName="h-center">
				<Button onPress={this.reload.bind(this)}>
					<Text>Reload</Text>
				</Button>
			</View>
		);
	}

	reload() {
		ConnectionStore.refreshPresentationList();
	}

	renderRow(presentation) {
		const title = get(presentation, 'info.title', 'Kein Title');
		return (
			<Touchable
				onPress={() => this.enterPresentationPassword(presentation)}
			>
				<Row>
					{this.clientGetCountry(presentation) ? (
						<Image
							styleName="small"
							source={{
								uri: this.clientGetCountry(presentation)
							}}
						/>
					) : null}
					<View styleName="vertical">
						<Subtitle>{title}</Subtitle>
						<Text numberOfLines={1}>
							{this.clientInfo(presentation)}
						</Text>
					</View>
					<Icon styleName="disclosure" name="right-arrow" />
				</Row>
			</Touchable>
		);
	}

	enterPresentationPassword(presentation) {
		Navigation.showModal({
			stack: {
				children: [
					{
						component: {
							name: 'io.noim.PasswordEnter',
							passProps: {
								presentation
							},
							options: {
								topBar: {
									title: {
										text: 'Enter Password'
									}
								}
							}
						}
					}
				]
			}
		});
	}

	clientGetCountry(pres) {
		const country = get(pres, 'info.client.ip.country_code', false);
		if (country) {
			const countryLowerCase = country.toLowerCase();
			return `https://www.countryflags.io/${countryLowerCase}/flat/32.png`;
		} else {
			return false;
		}
	}

	clientInfo(pres) {
		let string = '';
		const ip = get(pres, 'info.client.ip.ip', false);
		const os = get(pres, 'info.client.os', false);
		if (ip) {
			string = this.addAndExtend(string, ip);
		}
		if (os) {
			string = this.addAndExtend(string, os);
		}
		if (string === '') return false;
		return string;
	}

	addAndExtend(src, add) {
		if (src.endsWith(' - ')) {
			return src + add;
		} else {
			if (src !== '') {
				return src + ' - ' + add;
			} else {
				return src + add;
			}
		}
	}
}
