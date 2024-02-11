import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { BACKEND_API_URL } from "@env";
import React, { useState } from "react";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

const register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const handleRegister = () => {
    const User = {
      name: name,
      email: email,
      password: password,
    };

    const apiUrl = BACKEND_API_URL;
    axios
      .post(`${apiUrl}/api/users/register`, User)
      .then((res) => {
        setUserDetails(res.data);
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          Alert.alert(
            "Error",
            `Registration Failed: ${err.response.data.message}`
          );
        } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
          Alert.alert("Error", "No response was received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", err.message);
          Alert.alert("Error", "Error setting up request");
        }
        console.log(err.config);
      });
  };

  const afterRegistration = () => {
    setUserDetails(null), router.replace("/login");
  };

  const UserDetailsComponent = ({ details }) => {
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.welcomeText}>Welcome, {details.userName}!</Text>

        <View style={styles.detailRow}>
          <MaterialIcons name="email" size={24} color="#007FFF" />
          <Text style={styles.detailText}>{details.userEmail}</Text>
        </View>

        <View style={styles.detailRow}>
          <AntDesign name="idcard" size={24} color="#007FFF" />
          <Text style={styles.detailText}>
            Employee Number: {details.employeeNumber}
          </Text>
        </View>

        <Text style={styles.activationText}>
          Account has to be activated by Admin!
        </Text>

        <Pressable
          onPress={() => afterRegistration()}
          style={styles.goBackButton}
        >
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {userDetails ? (
        // Conditionally render UserDetailsComponent if registration is successful
        <UserDetailsComponent details={userDetails} />
      ) : (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
        >
          <View style={{ marginTop: 20 }}>
            <Image
              style={{ width: 150, height: 100, resizeMode: "contain" }}
              source={require("../../assets/screens/LoginScreen/Logo.webp")}
            />
          </View>
          <KeyboardAvoidingView>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginTop: 12,
                  color: "#041E42",
                }}
              >
                Register to your Account
              </Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <View style={{ marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: "#E0E0E0",
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginTop: 30,
                  }}
                >
                  <Ionicons
                    name="person"
                    style={{ marginLeft: 18 }}
                    size={24}
                    color="gray"
                  />
                  <TextInput
                    style={{
                      paddingLeft: 20,
                      color: "gray",
                      marginVertical: 10,
                      width: 300,
                    }}
                    placeholder="Name"
                    maxLength={100}
                    value={name}
                    onChangeText={(text) => setName(text)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: "#E0E0E0",
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginTop: 30,
                  }}
                >
                  <MaterialIcons
                    name="email"
                    style={{ marginLeft: 18 }}
                    size={24}
                    color="gray"
                  />
                  <TextInput
                    style={{
                      paddingLeft: 20,
                      color: "gray",
                      marginVertical: 10,
                      width: 300,
                    }}
                    placeholder="Email"
                    maxLength={100}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: "#E0E0E0",
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginTop: 30,
                  }}
                >
                  <AntDesign
                    style={{ marginLeft: 18 }}
                    name="lock1"
                    size={24}
                    color="gray"
                  />
                  <TextInput
                    secureTextEntry={true}
                    style={{
                      paddingLeft: 20,
                      color: "gray",
                      marginVertical: 10,
                      width: 300,
                    }}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                  />
                </View>
              </View>
              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              ></View>
              <View style={{ marginTop: 50 }}>
                <Pressable
                  onPress={handleRegister}
                  style={{
                    width: 200,
                    backgroundColor: "#007FFF",
                    borderRadius: 6,
                    marginLeft: "auto",
                    marginRight: "auto",
                    padding: 15,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                      letterSpacing: 2,
                    }}
                  >
                    Register
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => router.replace("/login")}
                  style={{ marginTop: 50 }}
                >
                  <Text
                    style={{ textAlign: "center", color: "gray", fontSize: 16 }}
                  >
                    Already have an account?{" "}
                    <Text
                      style={{
                        color: "#007FFF",
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      Sign Up
                    </Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  userDetailsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userDetailsText: {
    fontSize: 18,
    margin: 10,
  },
  goBackButton: {
    marginTop: 20,
    backgroundColor: "#007FFF",
    padding: 10,
    borderRadius: 5,
  },
  goBackButtonText: {
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  cardContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    color: "#041E42",
    marginBottom: 15,
    fontWeight: "bold",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to start on cross-axis in a row
    width: "100%", // Ensure the row takes the full width of the container
    marginBottom: 10,
  },
  detailText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
    textAlign: "left",
  },
  activationText: {
    fontSize: 16,
    color: "#d9534f", // Bootstrap's "danger" color for an alert tone
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: "#007FFF",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  goBackButtonText: {
    color: "white",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // A light grey background
    alignItems: "center",
    justifyContent: "center",
  },
});
