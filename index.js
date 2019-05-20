/**
 * @format
 */

import { Navigation } from 'react-native-navigation';
import App from './App';
import PasswordEnterScreen from './screens/Password';

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
