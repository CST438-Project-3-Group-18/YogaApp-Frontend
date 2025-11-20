import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// connect to backend
const API_BASE = 'https://yoga-and-you-4e1482948cb3.herokuapp.com';

type Pose = {
  id?: number;
  name: string;
  image: string;
  description: string;
  difficulty: string;
  style: string;
};

function SearchPageScreen() {
  const [keyword, setKeyword] = useState('');
  const [poses, setPoses] = useState<Pose[]>([]);
  const [error, setError] = useState('');

  const searchByDescription = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword to search.');
      setPoses([]);
      return;
    }

    try {
      setError('');
      const res = await fetch(`${API_BASE}/poses/search/${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setPoses(data);
      if (data.length === 0) setError('No poses found matching that description.');
          console.log(data)
    } catch (e) {
      console.error('Search error:', e);
      setError('Error fetching poses. Please try again.');
    }
  };

  return (
    <View style={styles.page}>
      {/* Title */}
      <Text style={styles.searchTitle}>Find Your Pose</Text>

      {/* Subheader */}
      <Text style={styles.subheader}>Search by description keyword</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Type a keyword..."
          placeholderTextColor="#aaa"
          value={keyword}
          onChangeText={setKeyword}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchByDescription}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Error message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Search Results */}
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {poses.map((pose) => (
          <View key={pose.id} style={styles.poseCard}>
            <Text style={styles.poseName}>{pose.name}</Text>
            <Image
              style={styles.imageContainer}
              source={{ uri: pose.image }}
              resizeMode="contain"
            />
            <Text style={styles.desc}>{pose.description}</Text>
            <View style={styles.level}>
              <Text style={styles.levelText}>Style: {pose.style}</Text>
              <Text style={styles.levelText}>Difficulty: {pose.difficulty}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fab9c8',
    paddingHorizontal: 15,
  },
  searchTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    color: '#7e86c4',
  },
  subheader: {
    fontSize: 15,
    textAlign: 'center',
    color: '#7e86c4',
    marginTop: 5,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 45,
    width: '70%',
    color: '#7e86c4',
  },
  searchButton: {
    backgroundColor: '#f78ba4',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
    width: 90,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#faf2f4',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#a33',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultsContainer: {
    paddingBottom: 100,
  },
  poseCard: {
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
  imageContainer: {
    marginTop: 15,
    alignSelf: 'center',
    width: 270,
    height: 220,
    borderRadius: 20,
  },
  desc: {
    fontSize: 15,
    color: '#7e86c4',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  level: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignSelf: 'center',
    width: 270,
    paddingVertical: 8,
    marginBottom: 10,
  },
  levelText: {
    fontStyle: 'italic',
    textAlign: 'left',
    marginLeft: 15,
  },
});

export default SearchPageScreen;
