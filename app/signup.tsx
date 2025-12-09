import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

const API_BASE = "http://10.0.2.2:8080";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signup = async () => {
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setMessage("Account created! You can now login.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Create Account</Text>

      {message ? <Text style={styles.error}>{message}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Create Account" onPress={signup} testID="signup-create-account-button"/>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 30, justifyContent: "center" },
  title: { fontSize: 26, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
});
