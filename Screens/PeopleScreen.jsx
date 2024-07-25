import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../Navigation/AuthContext';

const PeopleScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const {userToken, userid} = useContext(AuthContext);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const jwtToken = userToken; // Replace with your actual JWT token
      const response = await axios.get(
        `http://localhost:6000/users/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Properly format the Authorization header
          },
        },
      );
      setUsers(response.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSend = (senderid, receiverid) => {
    navigation.navigate('ChatBox', {
      senderid: senderid,
      receiverid: receiverid,
    });
    console.log(`Navigating to ChatBox for user ${senderid} with ID ${receiverid}`);
  };

  const renderItem = ({item}) => (
    <View style={styles.userContainer}>
      <Text style={styles.userName}>{item.username}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => handleSend(item._id, item.username)}>
        <Text style={styles.sendButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>People Screen</Text>
      <FlatList data={users} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    flexDirection: 'row',
    justifyContent: 'pace-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default PeopleScreen;
