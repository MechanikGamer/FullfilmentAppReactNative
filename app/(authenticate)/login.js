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
import React, { useState, useEffect } from "react";
import { Octicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { BACKEND_API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const CheckLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };
    CheckLoginStatus();
  }, []);
  const handleLogin = () => {
    const user = {
      employeeNumber,
      password,
    };

    const apiUrl = BACKEND_API_URL;
    axios
      .post(`${apiUrl}/api/users/login`, user)
      .then((res) => {
        const token = res.data.token;
        AsyncStorage.setItem("authToken", token);
        router.replace("/(tabs)/home");
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          Alert.alert("Error", `Login Failed: ${err.response.data.message}`);
        } else if (err.request) {
          console.log(err.request);
          Alert.alert("Error", "No response was received");
        } else {
          console.log("Error", err.message);
          Alert.alert("Error", "Error setting up request");
        }
        console.log(err.config);
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ marginTop: 40 }}>
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
            Log in to your Account
          </Text>
        </View>
        <View style={{ marginTop: 70 }}>
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
            <Octicons
              style={{ marginLeft: 18 }}
              name="number"
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
              placeholder="Employe number"
              keyboardType="numeric"
              maxLength={10}
              value={employeeNumber}
              onChangeText={(text) => setEmployeeNumber(text)}
            />
          </View>
          <View style={{ marginTop: 10 }}>
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
                maxLength={10}
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
          >
            <Text style={{ color: "#FFF" }}>Keep me logged in</Text>

            <Text style={{ color: "#007FFF", fontWeight: "500", fontSize: 16 }}>
              Forgot Password?
            </Text>
          </View>
          <View style={{ marginTop: 50 }}>
            <Pressable
              onPress={handleLogin}
              style={{
                width: 200,
                backgroundColor: "#DC3C5E",
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
                Login
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/register")}
              style={{ marginTop: 50 }}
            >
              <Text
                style={{ textAlign: "center", color: "gray", fontSize: 16 }}
              >
                Don't have an account?{" "}
                <Text
                  style={{ color: "#007FFF", fontSize: 18, fontWeight: "500" }}
                >
                  Register
                </Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
