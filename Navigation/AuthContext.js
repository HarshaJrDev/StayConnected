import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userid, setUserid] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserid(decodedToken.userid);
          setEmail(decodedToken.email);
          setUserToken(token);
        }
      } catch (error) {
        console.error('Error fetching token from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('jwtToken', token);
      const decodedToken = jwtDecode(token);
      setEmail(decodedToken.email);
      setUserid(decodedToken.userid);
      setUserToken(token);
    } catch (error) {
      console.error('Error storing token in AsyncStorage:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      setUserToken(null);
      setEmail(null);
      setUserid(null);
    } catch (error) {
      console.error('Error removing token from AsyncStorage:', error);
    }
  };

  if (isLoading) {
    return <></>; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, userid, email, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
