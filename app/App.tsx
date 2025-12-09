import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer
} from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ExploreScreen from './(tabs)/explore';
import HomePageScreen from './(tabs)/index';
import ProfileScreen from './(tabs)/profile';

WebBrowser.maybeCompleteAuthSession();

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GITHUB_CLIENT_ID = 'Ov23li6QVNUVNOswRlgd'; 
const githubDiscovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const redirectUri = AuthSession.makeRedirectUri({ native: 'com.danie.yogaapp://' });
  console.log('Redirect URI at runtime ->', redirectUri);

  const [authRequest, authResponse, triggerAuth] = Google.useAuthRequest({
    androidClientId:
      '181456544791-6h4v97c43o9phbdj8d3vmreg6f28tknm.apps.googleusercontent.com',
    webClientId:
      '181456544791-52n02d9nrea84gpcin4d001513mbrfn0.apps.googleusercontent.com',
    redirectUri,
  });

  const [githubRequest, githubResponse, triggerGithubAuth] =
    AuthSession.useAuthRequest(
      {
        clientId: GITHUB_CLIENT_ID,
        scopes: ['read:user', 'user:email'],
        redirectUri, // same redirect URI; must match what you set in GitHub
      },
      githubDiscovery
    );

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

  useEffect(() => {
    const handleGithub = async () => {
      if (githubResponse?.type === 'success') {
        const { code } = githubResponse.params as { code?: string };
        console.log('GitHub code:', code);

        
        const githubUser = { provider: 'github', code };
        try {
          setCurrentUser(githubUser);
          await AsyncStorage.setItem('@user_info', JSON.stringify(githubUser));
        } catch (e) {
          console.log('Error saving GitHub user:', e);
        }
        navigation.replace('Home');
      }
    };

    handleGithub();
  }, [githubResponse]);

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

      {}
      <TouchableOpacity
        style={[styles.googleButton, { marginTop: 16, backgroundColor: '#333' }]}
        onPress={() => githubRequest && triggerGithubAuth()}
        disabled={!githubRequest}
      >
        <Text style={styles.buttonText}>Continue with GitHub</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const Tab = createBottomTabNavigator();
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomePageScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="ExploreTab" component={ExploreScreen} options={{ title: 'Explore' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
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
  title: { fontSize: 28, fontWeight: '700', color: '#1A237E', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#5C6BC0', marginBottom: 40 },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
