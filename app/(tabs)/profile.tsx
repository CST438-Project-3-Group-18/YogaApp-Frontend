import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';


type Collection = {
  collection_id: string;
  user_id: string;
  name: string;
};

function ProfileScreen() {
    //hardcoded for now
    const name = 'Yogi';

    const [showModal, setShowModal] = React.useState(false);

    return (
    <View style={styles.page}>
      {/* Header */}
        <Text style={styles.hello}>
          Hello, <Text>{name}</Text>! 🙏
        </Text>
        <Text style={styles.subtitle}>
          Take a look at what collections are in store for you today!
        </Text>
      

      {/* Left-justified section title */}
      <Text style={styles.myCol}>My Collections</Text>
      <Pressable
            onPress={() => setShowModal(true)}
            style={({ pressed }) => [
              styles.addCard,
              pressed && { opacity: 0.95, transform: [{ scale: 0.998 }] },
            ]}
          >
            <MaterialIcons name="add-box" size={22} color="#ad2964ff" />
            <Text style={styles.addText}>Create new collection</Text>
          </Pressable>

    </View>
    )}

    //stylesheet
    const styles = StyleSheet.create({
    page: {
    flex: 1,
    backgroundColor: '#fab9c8', // web-safe background
    padding: 20,
    },
    hello: {
      fontSize: 28,
      margin: 10,
      textAlign: 'center',
      color: '#7e86c4',
    },
    subtitle: {
      fontSize: 16,
      color: '#7e86c4',
      textAlign: 'center',
    },
    myCol: {
        fontSize: 22,
        fontWeight: 'bold',
        padding:30,
        color: '#7e86c4',
    },
    addCard: {
        flexDirection: 'row',
        backgroundColor: '#f78ba4',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    addText: {
        fontSize: 16,
        marginLeft: 8,
        color: '#ad2964ff',
    },
    });

export default ProfileScreen;