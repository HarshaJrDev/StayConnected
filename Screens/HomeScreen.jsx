import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import ProfileScreen from './ProfileScreen';
const HomeScreen = ({}) => {
  const [image, setImage] = useState(null); // Changed initial state to null

  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: true,
    })
      .then(image => {
        console.log(image);
        const data = `data:${image.mime};base64,${image.data}`;
        setImage(data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const navigation = useNavigation();

  // Default images
  const defaultManImage = require('../Assets/man.png');
  const defaultWomanImage = require('../Assets/woman-2.png');

  return (
    <SafeAreaView>
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{shadowOffset: 20}}>
          <MaterialIcons name={'menu'} size={35} />
        </TouchableOpacity>
        <TouchableOpacity onPress={selectPhoto}>
          {/* Default image display */}
          <Image
            style={styles.roundedImage}
            source={image ? {uri: image} : defaultManImage}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PeopleScreen')}>
          <ProfileScreen />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  roundedImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5, // Half of width and height for perfect circle
    borderTopLeftRadius: 20, // Adjust as needed for specific corners
  },
});

export default HomeScreen;
