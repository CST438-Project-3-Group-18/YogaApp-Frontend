/**
 * Home Page Component
 * Includes random pose image, name, description, style, and difficulty
 * Randomize button
 * Save to collection button
 */
import { Image, StyleSheet, Text, View } from 'react-native';

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

        <View style={styles.poseContainer}>
          {/* Image - Hardcoded for now*/}
          <Image style={styles.imageContainer}
          source={{
            uri: 'https://hmtnijillluuhbsrdjvq.supabase.co/storage/v1/object/public/poses/downward_dog.jpg',
          }}
          />

        {/* Description - hardcoded for now*/}
        <View style={styles.description}>
            <Text style={styles.descriptionText}>Style: Yin</Text>
            <Text style={styles.descriptionText}>Difficulty: Easy</Text>
        </View>
    </View>
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
    },
    homeTitle:{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 50,
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
    description:{
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
    descriptionText: {
      fontStyle: 'italic',
      marginLeft: 15,
    }
    });
export default HomePageScreen;