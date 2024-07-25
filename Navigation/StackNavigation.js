import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../Navigation/AuthContext';
import HomeScreen from '../Screens/HomeScreen';
import LoginScreen from '../LogInScreens/LoginScreen';
import SignUpScreen from '../LogInScreens/SignUpScreen';
import BoardingScreen from '../LogInScreens/BoardingScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SignOut from '../Navigation/SignOut';
import PeopleScreen from '../Screens/PeopleScreen';
import ChatBox from '../Screens/ChatBox'

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = ({ route }) => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} initialParams={{ email: route.params?.email }} options={{ title: 'Home', headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const DrawerScreens = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
    <Drawer.Screen name="SignOut" component={SignOut} options={{ title: 'Sign Out' }} />
  </Drawer.Navigator>
);

const App = () => {
  const { userToken, isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={userToken ? 'DrawerScreens' : 'BoardingScreen'}>
      {userToken ? (
        <>
          <Stack.Screen name="DrawerScreens" component={DrawerScreens} options={{ headerShown: false, initialParams: { email } }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerStyle: { backgroundColor: '#FFCB43' } }}/>
        </>
      ) : (
        <>
          <Stack.Screen name="BoardingScreen" component={BoardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerStyle: { backgroundColor: '#FFCB43' } }} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerStyle: { backgroundColor: '#FFCB43' } }} />
          <Stack.Screen name="PeopleScreen" component={PeopleScreen} options={{ headerStyle: { backgroundColor: '#FFCB43' } }} />
          <Stack.Screen name="DrawerScreens" component={DrawerScreens} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerStyle: { backgroundColor: '#FFCB43' } }} />
          <Stack.Screen name="ChatBox" component={ChatBox} options={{ headerStyle: { backgroundColor: '#FFCB43' } }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;