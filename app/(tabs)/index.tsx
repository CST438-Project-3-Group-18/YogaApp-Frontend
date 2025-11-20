/**
 * Home Page Component
 * Includes random pose image, name, description, style, and difficulty
 * Randomize button
 * Save to collection button
 */
import * as React from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
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
type Collection = { id: number; user_id: number; name: string; };

type SavePoseModalProps = {
  visible: boolean;
  onClose: () => void;
  poseId: number;
};

function SavePoseModal({ visible, onClose, poseId }: SavePoseModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const userId = 0; // hardcoded for now

  React.useEffect(() => {
    if (!visible) return;
    // fetch collections for user 0 — you already have repo findByUserId
    // Make sure you expose GET /collections?userId=0 in your controller
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/collections?userId=${userId}`, {
          headers: { Accept: 'application/json' },
        });
        const data = await res.json();
        setCollections(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading collections:', e);
        setCollections([]);
      }
    })();
  }, [visible]);

  async function saveToCollection(collectionId: number) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ poseId }),
      });

      if (res.status === 201) {
        Toast.show('✅ Pose saved!', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#7e86c4', // matches your palette
          textColor: '#fff',
        });
        onClose();
        return;
      }
      const text = await res.text();
      if (res.status === 409) {
        Toast.show('⚠️ Pose already in that collection.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#f78ba4',
        });
      } else {
        Toast.show('⚠️ Error: could not save pose.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#f78ba4',
        });
      }
    } catch (e) {
      console.error('Save failed:', e);
      Alert.alert('Error', 'Network error while saving pose.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Save pose to a collection</Text>

          <ScrollView style={{ maxHeight: 320 }}>
            {collections.length === 0 ? (
              <Text style={{ color: '#7e86c4' }}>No collections found.</Text>
            ) : (
              collections.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => saveToCollection(c.id)}
                  style={({ pressed }) => [
                    styles.collectionRow,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.998 }] },
                  ]}
                  disabled={loading}
                >
                  <Text style={styles.collectionRowText}>{c.name}</Text>
                </Pressable>
              ))
            )}
          </ScrollView>

          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function HomePageScreen() {
  //onCreate setup
  const [pose, setPose] = React.useState<Pose>({
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

  //save modal
  const [saveVisible, setSaveVisible] = React.useState(false);


  const fetchRandomPose = async () => {
    try {
      const res = await fetch(`${API_BASE}/poses/random`);
      const data = await res.json();
      setPose(data);
    } catch (e) {
      console.error('Error fetching random pose:', e);
    }
  };


  React.useEffect(() => {
    fetchRandomPose();
  }, []);

  return (
    <View style={styles.page}>
      {/* Title */}
      <View>
        <Text style={styles.homeTitle}>Yoga & You</Text>
      </View>

      {/* Sub Header */}
      <View>
        <Text style={styles.subheader}>Find what's right for you today!</Text>
      </View>

      {/* Randomize Button */}
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
        {/* Name - Hardcoded for now*/}
        <Text style={styles.poseName}>{pose.name}</Text>
        {/* Image - Hardcoded for now*/}
        <Image style={styles.imageContainer}
          source={{
            uri: pose.image
          }}
          resizeMode="contain"
        />
        {/* Description - Hardcoded for now*/}
        <Text style={styles.poseName}>{pose.name}</Text>
        <Image style={styles.imageContainer} source={{ uri: pose.image }} resizeMode="contain" />
        <Text style={styles.desc}>{pose.description}</Text>
        <View style={styles.level}>
          <Text style={styles.levelText}>Style: {pose.style}</Text>
          <Text style={styles.levelText}>Difficulty: {pose.difficulty}</Text>
        </View>
      </View>


      {/* Save Button */}
      <Pressable onPress={() => setSaveVisible(true)} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save pose to collection</Text>
      </Pressable>

      <SavePoseModal
        visible={saveVisible}
        onClose={() => setSaveVisible(false)}
        poseId={pose?.id ?? -1}
      />

      <TouchableOpacity style={styles.saveButton} onPress={() => console.log('Pressed!')}>
        <Text style={styles.saveButtonText}>Save Pose to Collection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fab9c8', // web-safe background
  },
  poseContainer: {
    backgroundColor: '#e1e3fa',
    padding: 10,
    alignSelf: 'center',
    width: 300,
    borderRadius: 20,
    marginBottom: 20,
  },
  poseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7e86c4',
    textAlign: 'center',
    marginTop: 10,
  },
  desc: {
    fontSize: 15,
    color: '#7e86c4',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  homeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: '#7e86c4',
  },
  imageContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: 270,
    height: 250,
    borderRadius: 20,
  },
  subheader: {
    fontSize: 15,
    textAlign: 'center',
    color: '#7e86c4',
    marginTop: 5,
    marginBottom: 20,
  },
  level: {
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: 270,
    height: 55,
    borderRadius: 20,
    fontStyle: 'italic',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  levelText: {
    fontStyle: 'italic',
    marginLeft: 15,
  },
  randButton: {
    backgroundColor: '#f78ba4',
    padding: 10,
    marginBottom: 20,
    borderRadius: 20,
    width: 150,
    alignSelf: 'center',
  },
  randButtonText: {
    color: '#faf2f4',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#7e86c4',
    padding: 10,
    borderRadius: 20,
    width: 250,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#faf2f4',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    fontSize: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7e86c4',
    marginBottom: 12,
    textAlign: 'center',
  },
  collectionRow: {
    backgroundColor: '#e1e3fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  collectionRowText: { color: '#7e86c4', fontWeight: '700' },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
    backgroundColor: '#f78ba4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  closeText: { color: '#ad2964ff', fontWeight: '700' },
});
export default HomePageScreen;
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
