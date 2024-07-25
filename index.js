/**
 * @format
 */

import 'react-native-gesture-handler'; // Ensure this is at the top if you're using gesture handler
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
