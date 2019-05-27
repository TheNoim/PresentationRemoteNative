import React, { Component } from 'react';
import { Screen, NavigationBar, Title, Icon, Button } from '@shoutem/ui';
import ConnectionStore from './stores/Connection';
import { observer } from 'mobx-react/custom';
import PresentationList from './components/PresentationList';
import Selected from './components/Selected';
import { StatusBar } from 'react-native';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import KeepAwake from 'react-native-keep-awake';

@observer
export default class App extends Component {
	componentDidMount() {
		ConnectionStore.connect();
	}

	render() {
		return (
			<Screen>
				<StatusBarPaddingIOS />
				<NavigationBar
					centerComponent={<Title>{ConnectionStore.title}</Title>}
					styleName="inline"
					rightComponent={
						ConnectionStore.selected ? (
							<Button
								onPress={ConnectionStore.destroy.bind(
									ConnectionStore
								)}
							>
								<Icon name="close" />
							</Button>
						) : null
					}
				/>
				{ConnectionStore.connected && ConnectionStore.initialFetch ? (
					ConnectionStore.selected ? (
						<Selected />
					) : (
						<PresentationList />
					)
				) : (
					<Title>
						{ConnectionStore.connected ? (
							<Title>Connected. Fetching data...</Title>
						) : (
							<Title>Connecting...</Title>
						)}
					</Title>
				)}
				<KeepAwake />
			</Screen>
		);
	}
}
