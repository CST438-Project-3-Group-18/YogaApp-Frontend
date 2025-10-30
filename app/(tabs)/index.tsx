/**
 * Home Page Component
 * Includes random pose image, name, description, style, and difficulty
 * Randomize button
 * Save to collection button
 */
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function HomePageScreen(){
    return(
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
        <TouchableOpacity style={styles.randButton} onPress={() => console.log('Pressed!')}>
          <Text style={styles.randButtonText}>New Pose!</Text>
        </TouchableOpacity>

        <View style={styles.poseContainer}>
          {/* Name - Hardcoded for now*/}
          <Text style={styles.poseName}>Downward Dog</Text>
          {/* Image - Hardcoded for now*/}
          <Image style={styles.imageContainer}
          source={{
            uri: 'https://hmtnijillluuhbsrdjvq.supabase.co/storage/v1/object/public/poses/downward_dog.jpg',
          }}
          />
        {/* Description - Hardcoded for now*/}  
        <Text style={styles.desc}>A foundational pose that lengthens the spine and strengthens the arms and legs.</Text>

        {/* Style/Difficulty - hardcoded for now*/}
        <View style={styles.level}>
            <Text style={styles.levelText}>Style: Yin</Text>
            <Text style={styles.levelText}>Difficulty: Easy</Text>
        </View>
    </View>

    {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={() => console.log('Pressed!')}>
          <Text style={styles.saveButtonText}>Save Pose to Collection</Text>
        </TouchableOpacity>
    </View>
    )
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
    homeTitle:{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 30,
            color: '#7e86c4',
    },
    imageContainer:{
        marginTop: 20,
        alignSelf: 'center',
        width: 270,
        height: 250,
        borderRadius: 20,     
    },
    subheader:{
        fontSize: 15,
        textAlign: 'center',
        color: '#7e86c4',
        marginTop: 5,
        marginBottom: 20,
    },
    level:{
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
    });
export default HomePageScreen;