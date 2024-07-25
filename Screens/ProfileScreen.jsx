// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const ProfileScreen = ({ route }) => {
//   const { email } = route.params || {}; // Ensure default value to avoid undefined

//   return (
//     <View style={styles.container}>
//       <Text style={styles.emailText}>Email: {email}</Text>
//       {/* Other profile information */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emailText: {
//     fontSize: 18,
//   },
// });

// export default ProfileScreen;

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})