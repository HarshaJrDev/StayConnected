import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import React, {useState, useEffect, useContext} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {AuthContext} from '../Navigation/AuthContext';

const LoginScreen = () => {
  const {userToken, setUserToken} = useContext(AuthContext)
  const [state,setstate] = useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(()=>{
    if(userToken){
      navigation.replace('DrawerScreens',{screen:"DrawerScreens"})
    }

  },[userToken,navigation])

  const handleGoogleButtonPress = async () => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log('Google sign-in error', error);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    const data = await axios.post('http://localhost:6000/signin', {
      email,
      password,
    });
    setstate(data);
    navigation.navigate('DrawerScreens',{userToken});
    console
      .log({email, password})
      .then(async response => {
        if (response.status === 200) {
          const token = response.data.token;
          await AsyncStorage.setItem('jwtToken', token);
          setUserToken(token);
          navigation.replace('DrawerScreens', {
            email
           
          }); // Pass email to HomeScreen
        } else {
          throw new Error('Failed to sign in');
        }
      })
      .catch(error => {
        if(error.status ==500){
          Alert.alert('Error', 'Invalid credentials, please sign up.');
        }
        if (error.response?.status === 404) {
          Alert.alert('Create', 'Please create an account.');
        } else if (error.response?.status === 400) {
          Alert.alert('Error', 'Invalid credentials, please sign up.');
          navigation.navigate('SignUpScreen', {email, password});
        } else {
          Alert.alert('Error', error.message);
        }
        console.error(error);
      });
  };

  const handleChooseImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error:', response.error);
      } else {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Login Account</Text>
          <Ionicons name={'person-outline'} size={20} />
        </View>
        <Text style={styles.welcomeText}>Welcome Back User!</Text>
        <View style={styles.stayConnectedContainer}>
          <Text style={styles.stayText}>Stay</Text>
          <Text style={styles.connectedText}>Connected</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="hello@example.com"
          placeholderTextColor={'black'}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="..............."
          placeholderTextColor={'black'}
          secureTextEntry
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity onPress={handleSignIn} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.orLoginText}>
        ______________Or Login With ______________
      </Text>
      <TouchableOpacity onPress={handleGoogleButtonPress}>
        <Image
          style={styles.googleImage}
          source={require('../Assets/google.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleChooseImage}>
        <Text style={styles.pickImageText}>Pick Image</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{uri: selectedImage}} style={styles.selectedImage} />
      )}

      <View style={styles.registerContainer}>
        <Text>Not registered yet?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FFCB43',
    height: 150,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  loginText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  welcomeText: {
    marginTop: 5,
  },
  stayConnectedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  stayText: {
    fontFamily: 'Itim-Regular',
    textAlign: 'center',
    fontSize: 35,
    marginTop: 50,
  },
  connectedText: {
    fontFamily: 'Itim-Regular',
    textAlign: 'center',
    fontSize: 35,
    color: '#FFCB43',
    marginTop: 50,
  },
  inputContainer: {
    marginTop: 70,
    paddingHorizontal: 40,
    gap: 15,
  },
  input: {
    borderWidth: 0.2,
    height: 48,
    borderRadius: 10,
    paddingLeft: 20,
  },
  loginButton: {
    backgroundColor: '#FFCB43',
    marginTop: 20,
    height: 48,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  orLoginText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: 'gray',
  },
  googleImage: {
    height: 25,
    width: 25,
    alignSelf: 'center',
    marginTop: 25,
  },
  pickImageText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'blue',
  },
  selectedImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontFamily: 'Inter-Bold',
    marginLeft: 5,
  },
});
export default LoginScreen;
