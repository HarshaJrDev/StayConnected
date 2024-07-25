import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './Navigation/AuthContext';
import StackNavigation from '././Navigation/StackNavigation';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;