// import React from 'react';
// import { Button, StyleSheet } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';

// GoogleSignin.configure({
//   webClientId: '487676022616-g6j9e5qqp8q9k8rc5cv8ng0g6vlcg0p2.apps.googleusercontent.com', // Replace with your actual web client ID
// });

// export default function GoogleSignIn() {
//   async function onGoogleButtonPress() {
//     try {
//       // Check if your device supports Google Play
//       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
//       // Get the users ID token
//       const { idToken } = await GoogleSignin.signIn();

//       // Create a Google credential with the token
//       const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//       // Sign-in the user with the credential
//       await auth().signInWithCredential(googleCredential);
//       console.log('Signed in with Google!');
//     } catch (error) {
//       console.error('Google sign-in error:', error);
//     }
//   }

//   return (
//     <Button
//       title="Google Sign-In"
//       onPress={() => onGoogleButtonPress()}
//     />
//   );
// }

// const styles = StyleSheet.create({});


import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Authenticate from '../Firebase/Authenticate';
import Authenticated from '../Firebase/Authenticated';

GoogleSignin.configure({
    webClientId:'487676022616-g6j9e5qqp8q9k8rc5cv8ng0g6vlcg0p2.apps.googleusercontent.com'
});

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);

    auth().onAuthStateChanged((user) => {
        if (user) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    });


    async function handleGoogleButtonPress() {
        try {
            // get the user id token
            const { idToken } = await GoogleSignin.signIn();
            // create a credential using the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // authenticate the user using the credential
            return auth().signInWithCredential(googleCredential);
        } catch (error) {
            console.log("error", error);
        }
    }

    if (authenticated) {
        return <Authenticated />
    }
    return <Authenticate handleGoogleButtonPress={handleGoogleButtonPress} />
};

export default App;
