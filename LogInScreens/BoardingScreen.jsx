import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const BoardingScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{backgroundColor: '#FFCB45', width: '100%', height: '50%'}}>
      <View>
        <Image
          style={{backgroundColor: '#FFCB45', width: '100%'}}
          source={require('../Assets/martina-people-communicate-in-a-group-chat.png')}
        />
      </View>

      <View
        style={{
          backgroundColor: '#000000',
          width: '100%',
          height: '130%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          zIndex: 10,
          top: -30,
          padding: 45,
        }}>
        <Text
          numberOfLines={23}
          style={{fontFamily: 'Inter-Bold', color: 'white', fontSize: 37}}>
          Stay connected with your friends and family
        </Text>
        <View style={{display: 'flex', flexDirection: 'row', marginTop: 40}}>
          <Image
            style={{height: 23, width: 23}}
            source={require('../Assets/shield.png')}
          />
          <Text
            style={{
              color: 'white',
              marginTop: 7,
              marginLeft: 10,
              fontFamily: 'Inter-SemiBold',
              fontSize: 16,
            }}>
            Secure, private messaging
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{
            height: 64,
            width: 314,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            top: 25,
          }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Inter-Bold',
              textAlign: 'center',
              marginTop: 23,
            }}>
            Get Start
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default BoardingScreen;

const styles = StyleSheet.create({});
