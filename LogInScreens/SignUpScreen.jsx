import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // Make sure axios is installed

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const navigation = useNavigation();

  const handleChooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error:', response.error);
      } else {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: 'image/jpeg/jpg', // Adjust accordingly to the type of file you're uploading
        name: 'image.jpg'
      });
      const response = await axios.post('http://localhost:6000/UserRegister', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Alert.alert('Upload Success', response.data.message);
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Upload Error', 'Failed to upload image');
    }
  };

  const handleSignUp = async () => {
    // Example of sending data to a server using axios
    const formData = {
      username: username,
      email: email,
      phone: phone,
      password: password,
      image: selectedImage, // Add selectedImage to formData if needed
    };

    try {
      const response = await axios.post(
        'http://localhost:6000/UserRegister',
        formData
      );
      console.log('Server Response:', response.data);

      if (response.data.success) {
        Alert.alert(
          'Registration Successful',
          'You can now log in with your credentials'
        );
      } else {
        Alert.alert(
          'Create a Account Successfully',
          'Please login with your existing credentials'
        );
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Registration Failed', 'Please try again later');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Create User Account</Text>
            <Ionicons name={'person-outline'} size={20} />
          </View>
          <Text style={styles.welcomeText}>Welcome Back User!</Text>
          <View style={styles.stayConnectedContainer}>
            <Text style={styles.stayText}>Stay</Text>
            <Text style={styles.connectedText}>Connected</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <TouchableOpacity onPress={handleChooseImage}>
              <Text style={{ backgroundColor: '#FFCB43' }}>User Image</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: 60, height: 60, borderRadius: 50 }}
              />
            )}
          </View>

          <TouchableOpacity onPress={uploadImage}>
            <Text style={{ backgroundColor: '#FFCB43' }}>Upload Image</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={'black'}
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="hello@example.com"
            placeholderTextColor={'black'}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor={'black'}
            onChangeText={text => setPhone(text)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={'black'}
            secureTextEntry
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity onPress={handleSignUp} style={styles.loginButton}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orText}>
          ______________ Or Login With ______________
        </Text>

        {/* Include your Google login button here */}

        <View style={styles.signupContainer}>
          <Text>if registered!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.createAccountText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FFCB43',
    height: 140,
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
  },
  stayText: {
    fontFamily: 'Itim-Regular',
    textAlign: 'center',
    fontSize: 35,
    top: 110,
  },
  connectedText: {
    fontFamily: 'Itim-Regular',
    textAlign: 'center',
    fontSize: 35,
    top: 110,
    color: '#FFCB43',
  },
  inputContainer: {
    marginTop: 110,
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
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000',
  },
  orText: {
    textAlign: 'center',
    marginTop: 30,
  },
  googleIcon: {
    height: 25,
    width: 25,
    alignSelf: 'center',
    marginTop: 25,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  createAccountText: {
    fontFamily: 'Inter-Bold',
    marginLeft: 5,
  },
});

export default LoginScreen;
