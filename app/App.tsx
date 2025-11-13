import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HomeScreen from './(tabs)/index';

WebBrowser.maybeCompleteAuthSession();

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const redirectUri = AuthSession.makeRedirectUri({ native: 'com.danie.yogaapp://'});
  console.log('Redirect URI at runtime ->', redirectUri);

  const [authRequest, authResponse, triggerAuth] = Google.useAuthRequest({
    androidClientId:
      '181456544791-6h4v97c43o9phbdj8d3vmreg6f28tknm.apps.googleusercontent.com',
    webClientId:
      '181456544791-52n02d9nrea84gpcin4d001513mbrfn0.apps.googleusercontent.com',
    redirectUri,
  });
  

  useEffect(() => {
    if (authResponse?.type === 'success') {
      const token =
        authResponse.authentication?.accessToken ||
        authResponse.params?.access_token;
      if (token) {
        fetchGoogleProfile(token);
        return;
      }
    }
    restoreUserFromStorage();
  }, [authResponse]);

  const restoreUserFromStorage = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('@user_info');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        navigation.replace('Home');
      }
    } catch (e) {
      console.log('Error restoring user:', e);
    }
  };

  const fetchGoogleProfile = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      setCurrentUser(user);
      await AsyncStorage.setItem('@user_info', JSON.stringify(user));
      navigation.replace('Home');
    } catch (err) {
      console.log('Error retrieving user profile:', err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Welcome to YogaApp</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => authRequest && triggerAuth()}
        disabled={!authRequest}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Use render-prop to wrap Home in an independent tree AND forward props */}
        <Stack.Screen name="Home">
          {(props) => (
            <NavigationIndependentTree>
              <HomeScreen {...props} />
            </NavigationIndependentTree>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F2F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5C6BC0',
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
