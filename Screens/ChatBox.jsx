import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../Navigation/AuthContext';

const ChatRoomScreen = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState(''); // Initialize message state as a string
  const {userToken, setUserToken, userid, setUserid} = useContext(AuthContext);
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat Room',
      headerRight: () => {
        return (
          <TouchableOpacity style={{paddingRight: 10}}>
            <Text>{route?.params.receiverId}</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  const sendmessage = async () => {
    const userdata = {
      senderid: senderid,
      receiverid: receiverid,
      message: message,
    };
    try {
      const response = await axios.post(
        'http://localhost:6000/sendRequest', // Use your machine's IP address here
        userdata,
      );
      if (response.status === 200) {
        console.log(userdata);
      
        setMessage(''); // Clear the input field
        Alert.alert(
          'Request Send Successfully',
          'Your message has been sent to the Friend',
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Type your message..."
        value={message}
        onChangeText={text => setMessage(text)}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendmessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatRoomScreen;
