// (tabs)/index.tsx
import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_BASE = 'http://10.0.2.2:8080';

type Pose = {
  id?: number;
  name: string;
  image: string;
  description: string;
  difficulty: string;
  style: string;
};

export default function HomePageScreen() {
  const navigation = useNavigation<any>();
  const [pose, setPose] = useState<Pose>({
    id: undefined,
    name: '',
    image: '',
    description: '',
    difficulty: '',
    style: '',
  });

  const fetchRandomPose = async () => {
    try {
      const res = await fetch(`${API_BASE}/poses/random`);
      const data = await res.json();
      setPose(data);
    } catch (e) {
      console.error('Error fetching random pose:', e);
    }
  };

  useEffect(() => {
    fetchRandomPose();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('google_access_token');
      if (token) {
        try {
          await fetch('https://oauth2.googleapis.com/revoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${encodeURIComponent(token)}`,
          });
        } catch {}
      }
      await AsyncStorage.removeItem('google_access_token');
      await AsyncStorage.removeItem('@user_info');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <View style={styles.page}>
      {/* Floating Logout — always visible */}
      <TouchableOpacity onPress={handleLogout} style={styles.floatingLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.homeTitle}>Yoga & You</Text>
      <Text style={styles.subheader}>Find what&apos;s right for you today!</Text>

      <TouchableOpacity style={styles.randButton} onPress={fetchRandomPose}>
        <Text style={styles.randButtonText}>New Pose!</Text>
      </TouchableOpacity>

      <View style={styles.poseContainer}>
        <Text style={styles.poseName}>{pose.name}</Text>
        <Image style={styles.imageContainer} source={{ uri: pose.image }} resizeMode="contain" />
        <Text style={styles.desc}>{pose.description}</Text>
        <View style={styles.level}>
          <Text style={styles.levelText}>Style: {pose.style}</Text>
          <Text style={styles.levelText}>Difficulty: {pose.difficulty}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => console.log('Pressed!')}>
        <Text style={styles.saveButtonText}>Save Pose to Collection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fab9c8' },
  floatingLogout: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 0) + 10,
    right: 12,
    zIndex: 1000,
    backgroundColor: '#7e86c4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    elevation: 4,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  homeTitle: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 40, color: '#7e86c4' },
  subheader: { fontSize: 15, textAlign: 'center', color: '#7e86c4', marginTop: 5, marginBottom: 20 },
  randButton: { backgroundColor: '#f78ba4', padding: 10, marginBottom: 20, borderRadius: 20, width: 150, alignSelf: 'center' },
  randButtonText: { color: '#faf2f4', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  poseContainer: { backgroundColor: '#e1e3fa', padding: 10, alignSelf: 'center', width: 300, borderRadius: 20, marginBottom: 20 },
  poseName: { fontSize: 22, fontWeight: 'bold', color: '#7e86c4', textAlign: 'center', marginTop: 10 },
  imageContainer: { marginTop: 20, alignSelf: 'center', width: 270, height: 250, borderRadius: 20 },
  desc: { fontSize: 15, color: '#7e86c4', marginTop: 15, paddingHorizontal: 10 },
  level: { marginTop: 20, marginBottom: 15, backgroundColor: '#fff', width: 270, height: 55, borderRadius: 20, alignSelf: 'center', justifyContent: 'center' },
  levelText: { fontStyle: 'italic', marginLeft: 15 },
  saveButton: { backgroundColor: '#7e86c4', padding: 10, borderRadius: 20, width: 250, alignSelf: 'center' },
  saveButtonText: { color: '#faf2f4', fontWeight: 'bold', textAlign: 'center', padding: 5, fontSize: 18 },
});
