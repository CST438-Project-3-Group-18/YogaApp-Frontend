import { MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from 'react-native';


type Collection = {
  id: number;
  user_id: string;
  name: string;
};

//pose items
type PoseItem = {
  id: number;
  name: string;
  style: string;
  difficulty: string;
  position: number;
  description?: string;
  imageUrl?: string;
};

function ProfileScreen() {
  //hardcoded for now, will change later
  const name = 'Yogi';
  const userId = '0';

  // state
  const [collections, setCollections] = React.useState<Collection[]>([]);

  // create modal
  const [createVisible, setCreateVisible] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');

  // items modal
  const [itemsVisible, setItemsVisible] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState<Collection | null>(null);
  const [selectedItems, setSelectedItems] = React.useState<PoseItem[]>([]);

  //get existing collections
  async function fetchCollections() {
    try {
      const res = await fetch('http://localhost:8080/collections', {
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      setCollections(data || []);
    }
    catch (e) {
      console.error('Error fetching collections:', e);
    }
  }
  //create new collection
  async function createCollection(name: string) {
    try {
      await fetch('http://localhost:8080/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, user_id: userId }),
      });
      // refresh list
      await fetchCollections();
    } catch (e) {
      console.error('Error creating collection:', e);
    }
  }

  // open modal to show a collection's items
  async function openItemsModal(col: Collection) {
    setSelectedCollection(col);
    setItemsVisible(true);
    try {
      const res = await fetch(`http://localhost:8080/collections/${col.id}/items`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        console.error('Items fetch failed', res.status, await res.text());
        setSelectedItems([]);
        return;
      }

      const data = await res.json();
      const items: PoseItem[] = Array.isArray(data) ? data : (data.items ?? []);
      items.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      setSelectedItems(items);
    } catch (e) {
      console.error('Error fetching collection items:', e);
      setSelectedItems([]);
    }
  }

  React.useEffect(() => {
    fetchCollections();
  }, []);


  return (
    <View style={styles.page}>
      {/* Header */}
      <Text style={styles.hello}>
        Hello, <Text>{name}</Text>! 🙏
      </Text>
      <Text style={styles.subtitle}>
        ✨Take a look at what collections are in store for you today!✨
      </Text>

      {/* Collections Section */}
      <View style={styles.colContainer}>
        <Text style={styles.myCol}>My Collections</Text>

        {/* Existing collections list */}
        <ScrollView
          style={{ maxHeight: 300 }}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }}
        >
          {Array.isArray(collections) && collections.length > 0 ? (
            collections.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => openItemsModal(c)}
                style={({ pressed }) => [
                  styles.collectionCard,
                  pressed && { opacity: 0.95, transform: [{ scale: 0.998 }] },
                ]}
              >
                <MaterialIcons name="self-improvement" size={24} color="#db61a4ff" />
                <Text style={styles.collectionText}>{c.name}</Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: '#7e86c4', paddingHorizontal: 4, paddingBottom: 8 }}>
              No collections yet.
            </Text>
          )}
        </ScrollView>

        {/* Add new collection button */}
        <Pressable
          onPress={() => setCreateVisible(true)}
          style={({ pressed }) => [
            styles.addCard,
            pressed && { opacity: 0.95, transform: [{ scale: 0.998 }] },
          ]}
        >
          <MaterialIcons name="add-box" size={22} color="#ad2964ff" />
          <Text style={styles.addText}>Create new collection</Text>
        </Pressable>
      </View>

      {/* Create Collection Modal */}
      <Modal
        visible={createVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Name your new collection</Text>
            <TextInput
              value={newCollectionName}
              onChangeText={setNewCollectionName}
              placeholder="e.g., Morning Stretches"
              placeholderTextColor="#a7a7a7"
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.saveBtn}
                onPress={async () => {
                  if (!newCollectionName.trim()) return;
                  await createCollection(newCollectionName.trim());
                  setNewCollectionName('');
                  setCreateVisible(false);
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>

              <Pressable style={styles.cancelBtn} onPress={() => setCreateVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Collection Items Modal */}
      <Modal
        visible={itemsVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setItemsVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.itemsCard}>
            <Text style={styles.modalTitle}>
              {selectedCollection ? selectedCollection.name : 'Collection'}
            </Text>
            <ScrollView style={styles.itemsScroll} contentContainerStyle={{ paddingBottom: 12 }}>
              {(selectedItems?.length ?? 0) === 0 ? (
                <Text style={{ color: '#7e86c4' }}>No items found.</Text>
              ) : (
                selectedItems.map((p: PoseItem) => (
                  <View key={p.id} style={styles.poseCard}>
                    <Text style={styles.poseTitle}>{p.name}</Text>
                    {p.description ? <Text style={styles.poseDesc}>{p.description}</Text> : null}
                    <View style={styles.poseMeta}>
                      <Text style={styles.metaItalic}>Style: {p.style}</Text>
                      <Text style={styles.metaItalic}>Difficulty: {p.difficulty}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <Pressable style={styles.closeBtn} onPress={() => setItemsVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#7e86c4',
    textAlign: 'center',
  },
  colContainer: {
    backgroundColor: '#e1e3fa',
    padding: 10,
    alignSelf: 'center',
    width: 300,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 30,
  },
  myCol: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    color: '#7e86c4',
    textDecorationLine: 'underline',
  },
  collectionCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  collectionText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#7e86c4',
    fontWeight: '600',
  },
  addCard: {
    flexDirection: 'row',
    backgroundColor: '#f78ba4',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    width: 260,
    alignSelf: 'center',
  },
  addText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#ad2964ff',
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
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  itemsCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7e86c4',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'flex-end',
    gap: 10,
  },
  saveBtn: {
    backgroundColor: '#ad2964ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveText: { color: '#fff', fontWeight: '700' },
  cancelBtn: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelText: { color: '#444', fontWeight: '600' },
  itemsScroll: { maxHeight: 380, marginTop: 8 },
  jsonText: { fontFamily: 'monospace', fontSize: 13, color: '#222' },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
    backgroundColor: '#f78ba4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  closeText: { color: '#ad2964ff', fontWeight: '700' },
  poseCard: {
    backgroundColor: '#e1e3fa',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  poseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7e86c4',
    textAlign: 'center',
    marginBottom: 10,
  },
  poseDesc: { color: '#7e86c4', marginBottom: 10 },
  poseMeta: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  metaItalic: { fontStyle: 'italic', color: '#333' },

});

export default ProfileScreen;