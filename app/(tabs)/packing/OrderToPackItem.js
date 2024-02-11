import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const OrderToPackItem = ({ data, productDetails }) => {
  // Calculate the total items to pack
  const totalItemsToPack = data.line_items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <View style={styles.itemContainer}>
      <View style={styles.ContainerbackgroundColor}>
        <View style={styles.itemHeaderView}>
          <Text style={styles.orderId}>Order ID: {data.orderId}</Text>
          <Text style={styles.itemsToPack}>
            Items to Pack: {totalItemsToPack}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Link
              href={{
                pathname: "/vieworderscreen/[id]",
                params: { id: data.orderId },
              }}
            >
              <View style={styles.buttonRow}>
                <MaterialIcons name="visibility" size={24} color="white" />
                <Text style={styles.buttonText}>View Order</Text>
              </View>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Link
              href={{
                pathname: "/startpackingscreen/[id]",
                params: { id: data.orderId },
              }}
            >
              <View style={styles.buttonRow}>
                <MaterialIcons name="move-to-inbox" size={24} color="white" />
                <Text style={styles.buttonText}>Start Packing</Text>
              </View>
            </Link>
          </TouchableOpacity>
        </View>
      </View>

      {data.line_items.map((lineItem) => {
        const detail = productDetails.find((p) => p.SKU === lineItem.sku);
        return (
          <View key={lineItem.id} style={styles.lineItem}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: lineItem.image.src || "default_image_url" }}
              />
            </View>
            <View style={styles.detailsContainer}>
              {detail && (
                <>
                  <Text style={styles.itemName}>Name: {detail.name}</Text>
                </>
              )}

              <Text style={styles.itemSKU}>SKU: {lineItem.sku}</Text>
              {detail && (
                <>
                  <Text style={styles.additionalDetailEAN}>
                    EAN: {detail.EAN}
                  </Text>
                </>
              )}
              <Text style={styles.itemQuantity}>
                Quantity:{"   "}
                <Text style={styles.itemQuantityNumber}>
                  {lineItem.quantity}
                </Text>
              </Text>
              {/* Display additional product details if available */}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default OrderToPackItem;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "green",
  },
  ContainerbackgroundColor: {
    backgroundColor: "#e6e6e6", // A distinct but still soft shade of grey
    flexDirection: "column",
    padding: 0,
    marginBottom: 10, // Increase space between header and list items
    borderRadius: 10,
    borderWidth: 2, // Optional: adding a border for emphasis
    borderColor: "#d1d1d1", // A color that complements the background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemHeaderView: {
    backgroundColor: "#e6e6e6", // A distinct but still soft shade of grey
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 2, // Increase space between header and list items
    borderRadius: 10,
    borderWidth: 2, // Optional: adding a border for emphasis
    borderColor: "#d1d1d1", // A color that complements the background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: "row", // Aligns children in a row
    alignItems: "center", // Centers children vertically in the row
    // Add additional styling as needed
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 18,
  },
  itemsToPack: {
    fontWeight: "bold",
    fontSize: 16,
  },
  lineItem: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically
    marginBottom: 10,
    padding: 10, // Adds padding inside each item for a spacious feel
    backgroundColor: "#ffffff", // Consider giving each item a distinct background
    borderBottomColor: "#e0e0e0", // Softer shade of grey
    borderBottomWidth: 1, // Only bottom border to separate items
    borderRadius: 5, // Slightly rounded corners for a smoother look
    shadowColor: "#000", // Optional: for depth
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // Elevation for Android
  },

  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 120,
    height: 120,
  },
  detailsContainer: {
    flex: 1, // Take up remaining space
    justifyContent: "center", // Center details vertically if you want
  },
  itemName: {
    padding: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemSKU: {
    fontFamily: "monospace",
    padding: 5,
    fontSize: 16,
    // Additional styling for item SKU if needed
  },
  additionalDetailEAN: {
    fontFamily: "monospace",
    padding: 5,
    fontSize: 16,
  },
  itemQuantity: {
    padding: 5,
    fontSize: 16,
    // Additional styling for item quantity if needed
  },
  itemQuantityNumber: {
    fontWeight: "bold",
    // Additional styling for item quantity number if needed
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center", // Align icon and text vertically in the center
    justifyContent: "center", // Center icon and text horizontally
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: 3,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10, // Space between the icon and the text
  },
  // Other styles you might need
});
