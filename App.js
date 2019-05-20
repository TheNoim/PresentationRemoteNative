import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Screen, NavigationBar, Title, Icon, Button } from '@shoutem/ui';
import ConnectionStore from './stores/Connection';
import { observer } from 'mobx-react/custom';
import PresentationList from './components/PresentationList';
import Selected from './components/Selected';

@observer
export default class App extends Component {
	componentDidMount() {
		ConnectionStore.connect();
	}

	render() {
		return (
			<Screen>
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
					) : ConnectionStore.renderControl ? (
						<PresentationList />
					) : null
				) : (
					<Title>
						{ConnectionStore.connected ? (
							<Title>Connected. Fetching data...</Title>
						) : (
							<Title>Connecting...</Title>
						)}
					</Title>
				)}
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {}
});
