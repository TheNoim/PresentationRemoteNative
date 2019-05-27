/**
 * @format
 */

import { Navigation } from 'react-native-navigation';
import App from './App';
import PasswordEnterScreen from './screens/Password';
import { YellowBox } from 'react-native';

Navigation.registerComponent(`io.noim.WelcomeScreen`, () => App);
Navigation.registerComponent(
	`io.noim.PasswordEnter`,
	() => PasswordEnterScreen
);

Navigation.events().registerAppLaunchedListener(() => {
	Navigation.setRoot({
		root: {
			component: {
				name: 'io.noim.WelcomeScreen'
			}
		}
	});
});

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
	'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
