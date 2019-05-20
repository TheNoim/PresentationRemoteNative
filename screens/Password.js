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
	TextInput
} from '@shoutem/ui';
import { observer } from 'mobx-react/custom';
import { get } from 'lodash';
import { observable } from 'mobx';
import { Navigation } from 'react-native-navigation';

@observer
export default class PasswordEnterScreen extends Component {
	@observable presentation = null;

	constructor(props) {
		super(props);
		this.presentation = props.presentation;
	}

	render() {
		const presentation = this.presentation;
		const title = get(presentation, 'info.title', 'Kein Title');
		const id = get(presentation, 'id');

		return (
			<View>
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
				</Row>
				<TextInput
					onChangeText={ConnectionStore.setPassword.bind(
						ConnectionStore
					)}
					placeholder={'Password'}
					secureTextEntry
				/>
				<Row>
					<View>
						<Button onPress={() => ConnectionStore.subscribeTo(id)}>
							<Text>Connect</Text>
						</Button>
					</View>
					<View>
						<Button onPress={this.dismiss}>
							<Text>Dismiss</Text>
						</Button>
					</View>
				</Row>
			</View>
		);
	}

	dismiss() {
		Navigation.dismissAllModals();
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
