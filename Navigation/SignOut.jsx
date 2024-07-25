import React, { useState } from 'react';
import { Button, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Placeholder for login state
  const navigation = useNavigation(); // Access navigation object

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken'); // Remove the JWT token from AsyncStorage
      setIsLoggedIn(false); // Update local state or navigation state to indicate logged out
      Alert.alert('Success', 'Logged out successfully');
      navigation.replace('Login'); // Navigate to BoardingScreen after logout
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default App;
