import * as Google from "expo-auth-session/providers/google";
import { useRouter } from 'expo-router';
import * as WebBrowser from "expo-web-browser";
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const webClientID = '181456544791-52n02d9nrea84gpcin4d001513mbrfn0.apps.googleusercontent.com'
const androidClientID = '181456544791-6h4v97c43o9phbdj8d3vmreg6f28tknm.apps.googleusercontent.com'

WebBrowser.maybeCompleteAuthSession();


const login = () => {
    const config = {
        clientId: webClientID,
        androidClientId: androidClientID
    }

    const [request, response, promptAsync] = Google.useAuthRequest(config);

    const router = useRouter();

    const handleToken = () => {
        if(response?.type === "success"){
            const {authentication} = response;
            const token = authentication?.accessToken;
            console.log("access token", token)
            // Navigate to the Home screen and replace the login route so user can't go back to it
            router.replace('/(tabs)');
        }
    }

    useEffect(() => {
        handleToken();
    }, [response])

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.wrapper} onPress={() => promptAsync()}>
                <Text style={styles.txt}>Login With Google</Text>
            </TouchableOpacity>
        </View>
    )
}

export default login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
      },
      wrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 3, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: "#ddd",
      },
      brand: {
        width: 28,
        height: 28,
        marginRight: 12,
      },
      txt: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
      },
})