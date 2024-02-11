import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PackingHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={[styles.button, styles.scanButton]}
        onPress={() => console.log("Scan Barcode Pressed")}
      >
        <Ionicons name="barcode" size={24} color="white" />
        <Text style={styles.buttonText}>Scan Barcode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.searchButton]}
        onPress={() => console.log("Search Order Pressed")}
      >
        <Ionicons name="search" size={24} color="white" />
        <Text style={styles.buttonText}>Search Order</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PackingHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f2f2f2", // A soft shade of grey
    borderBottomWidth: 1,
    borderColor: "#d1d1d1",
    elevation: 4, // For Android: adds elevation
    shadowColor: "#000", // For iOS: adds shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  scanButton: {
    backgroundColor: "#007bff", // A distinct blue color for importance
    // Add any additional styling for the scan button here
  },
  searchButton: {
    backgroundColor: "#007bff", // A distinct green color for importance
    // Add any additional styling for the search button here
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5, // If using an icon, gives space between icon and text
  },
  // ... add any additional styles
});
