import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API_URL } from "@env";
import axios from "axios";
import * as Print from "expo-print";
import { LinearGradient } from "expo-linear-gradient";

const PrintLabelComponent = (props) => {
  const [labelAmount, setLabelAmount] = useState("1");
  const { orderId } = props;

  const handleLabelAmountChange = (text) => {
    const number = parseInt(text, 10);

    // Allow the user to clear the input or keep it within 1-10
    if (text === "" || (number >= 1 && number <= 10)) {
      setLabelAmount(text);
    }
  };

  const handlePrint = async () => {
    console.log(`Printing ${labelAmount} labels...`);
    try {
      const token = await AsyncStorage.getItem("authToken");

      // Check if token is available
      if (!token) {
        Alert.alert("Error", "Authentication token not found.");
        return;
      }

      // Make a request to the backend
      const response = await axios.post(
        `${BACKEND_API_URL}/api/orders/fill-pdf`,
        {
          orderId: orderId,
          labelAmount: labelAmount,
        },
        {
          headers: { token: token },
        }
      );

      const { url } = response.data;

      if (url) {
        // Print the PDF from the URL
        await Print.printAsync({ uri: url });
      } else {
        console.error("PDF URL not received");
        Alert.alert("Error", "PDF URL not received.");
      }
    } catch (error) {
      console.error("Error printing label: ", error);
      Alert.alert("Error", `Printing failed: ${error.message}`);
    }
  };

  const postnummer = "12345"; // This will be dynamic in the future
  const postrejon = "9"; // This will be dynamic in the future

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#e6e6e6", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <Text style={styles.headerText}>Sending Info</Text>
      </LinearGradient>

      {/* Repeat the LinearGradient component for each section that needs it */}
      <LinearGradient
        colors={["#f0f7ff", "#e0eafc"]}
        style={styles.flexContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.infoText}>Budcode: </Text>
        <Text style={styles.NewInfoText}>{postrejon}</Text>
      </LinearGradient>

      <LinearGradient
        colors={["#f0f7ff", "#e0eafc"]}
        style={styles.flexContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.infoText}>PostNord: </Text>
        <Text style={styles.NewInfoText}>NO</Text>
      </LinearGradient>

      <LinearGradient
        colors={["#f0f7ff", "#e0eafc"]}
        style={styles.flexContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.infoText}>Postcode: </Text>
        <Text style={styles.NewInfoText}>{postnummer}</Text>
      </LinearGradient>

      <View style={styles.packagescontainer}>
        <Text style={styles.questionText}>How many packages?</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={labelAmount}
          maxLength={2}
          onChangeText={handleLabelAmountChange}
        />
        <Pressable
          style={({ pressed }) => [
            styles.pressableButton,
            { backgroundColor: pressed ? "#0056b3" : "#007bff" }, // Darker when pressed
          ]}
          onPress={handlePrint}
        >
          {({ pressed }) => (
            <Text style={styles.pressableButtonText}>
              {pressed ? "Printing..." : "Print Label"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginBottom: 10,
    width: "100%",
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  flexContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  packagescontainer: {
    marginTop: 50,
  },
  NewInfoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  pressableButton: {
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pressableButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrintLabelComponent;
