import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API_URL } from "@env";
import { Link } from "expo-router";
import PrintLabelComponent from "./PrintLabelComponent";

const Index = () => {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ToPackEan, setToPackEan] = useState([]);
  const params = useLocalSearchParams();
  const orderId = params.id;

  useEffect(() => {
    fetchOrderData(params.id);
  }, [params.id]);

  useEffect(() => {}, [ToPackEan]);

  const fetchOrderData = async (orderId) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const apiUrl = BACKEND_API_URL;

      const response = await axios.post(
        `${apiUrl}/api/orders/orderdata`,
        { orderId: orderId },
        { headers: { token: token } }
      );

      const extractedSkus = response.data.line_items.map((item) => item.sku);
      const productDetailsResponse = await axios.post(
        `${apiUrl}/api/orders/product-details`,
        { skus: extractedSkus },
        { headers: { token: token } }
      );

      const combinedData = response.data.line_items.map((item) => {
        const productDetail = productDetailsResponse.data.find(
          (detail) => detail.SKU === item.sku
        );
        return {
          ...item,
          name: productDetail ? productDetail.name : "",
          EAN: productDetail ? productDetail.EAN : "",
          image: item.image ? item.image.src : defaultImageUrl,
        };
      });

      setOrderData({ ...response.data, line_items: combinedData });
      setIsLoading(false);

      const toPackData = combinedData.map((item) => ({
        EAN: item.EAN,
        quantity: item.quantity,
        packedQuantity: 0,
      }));

      setToPackEan(toPackData);
    } catch (error) {
      console.error("Error fetching order data:", error);
      setIsLoading(false);
    }
  };

  const handleManualPacking = (ean, quantity) => {
    Alert.alert(
      "Manual Packing",
      "Are you sure that you want to manually pack this item?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            setToPackEan((prevToPackEan) => {
              const updatedEan = prevToPackEan.map((item) => {
                if (String(item.EAN) === String(ean)) {
                  const newPackedQuantity =
                    item.packedQuantity < quantity
                      ? item.packedQuantity + 1
                      : item.packedQuantity;

                  // Check if all items are packed
                  if (newPackedQuantity === quantity) {
                    Alert.alert(
                      "All items packed",
                      `All items for EAN: ${ean} are now packed.`
                    );
                  }

                  return {
                    ...item,
                    packedQuantity: newPackedQuantity,
                  };
                }
                return item;
              });
              return updatedEan;
            });
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setOrderData(null);
    setToPackEan([]);
  };

  const handleSave = () => {
    // Your logic here
  };

  const defaultImageUrl = "path_to_default_image"; // Replace with your default image path

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Packing Order {params.id}</Text>
      </View>
      <ScrollView style={styles.table}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : orderData && orderData.line_items ? (
          orderData.line_items.map((item, index) => {
            const packedItem = ToPackEan.find((p) => p.EAN === item.EAN) || {
              packedQuantity: 0,
            };

            const isFullyPacked = packedItem.packedQuantity === item.quantity;
            const detailsBackgroundColor = isFullyPacked
              ? "lightgreen"
              : "white";

            const textColor =
              packedItem.packedQuantity < item.quantity ? "red" : "green";

            return (
              <View
                key={item.EAN}
                style={[
                  styles.tableRow,
                  { backgroundColor: isFullyPacked ? "lightgreen" : "white" },
                ]}
              >
                <Image
                  source={{ uri: item.image || defaultImageUrl }}
                  style={styles.itemPhoto}
                />
                <View
                  style={[
                    styles.itemDetails,
                    { backgroundColor: detailsBackgroundColor },
                  ]}
                >
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailBoldValue}>{item.name}</Text>
                  </View>
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>SKU:</Text>
                    <Text style={styles.detailValuemono}>{item.sku}</Text>
                  </View>
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>EAN:</Text>
                    <Text style={styles.detailValuemono}>{item.EAN}</Text>
                  </View>
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Quantity:</Text>
                    <Text style={styles.detailBoldValue}>{item.quantity}</Text>
                  </View>
                </View>
                <View>
                  <Text style={[styles.packedItemsText, { color: textColor }]}>
                    Packed Items: {packedItem.packedQuantity} / {item.quantity}
                  </Text>
                </View>

                {packedItem.packedQuantity < item.quantity && (
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: pressed ? "#ddd" : "#007bff" }, // Change color on press
                      ]}
                      onPress={() =>
                        handleManualPacking(item.EAN, item.quantity)
                      }
                    >
                      {({ pressed }) => (
                        <Text style={styles.text}>
                          {pressed ? "Packing..." : "Manual Packing"}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                )}
                <View style={styles.separatorbar}></View>
              </View>
            );
          })
        ) : (
          <Text>No order data available</Text>
        )}
        <View style={styles.tableRow}>
          <PrintLabelComponent orderId={orderId} />
        </View>
      </ScrollView>

      <View style={styles.footerButtons}>
        <Link onPress={handleCancel} href="/packing" style={styles.linkStyle}>
          <Text style={styles.Cancelbuton}>Cancel</Text>
        </Link>

        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#d9d9d9",
    padding: 15,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  table: {
    flex: 1,
    backgroundColor: "white",
  },
  tableRow: {
    backgroundColor: "#ffffff", // Add a white background for each item
    marginBottom: 15,
    borderRadius: 10, // Rounded corners
    overflow: "hidden", // Keep everything within the rounded corners
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // for Android
  },
  itemPhoto: {
    width: "100%",
    height: 250, // Adjust height for better aspect ratio
    resizeMode: "contain", // Cover will fill the area, might crop the image
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 5,
    padding: 5,
    fontSize: 16,
  },
  itemDetails: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#555",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
  },
  packedItemsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50", // Green color for emphasis
    marginTop: 25,
    marginBottom: 25,
    marginLeft: 20,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#d9d9d9",
  },
  buttonStyle: {
    backgroundColor: "#4CAF50", // Matching the green color
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  separatorbar: {
    height: 1, // Keep the separator thin
    marginTop: 10,
    marginBottom: 10,
    width: "90%", // Control the width to not span the full container width
    alignSelf: "center", // Center the separator within the container
    backgroundColor: "transparent", // Make the background transparent
    borderColor: "#d9d9d9", // Choose a color for the dashes/dots
    borderWidth: 1,
    borderRadius: 1, // Optional: slightly round the dots/dashes for a smoother appearance
    borderStyle: "dotted", // Change this to 'dashed' if you prefer dashes over dots
  },
  linkStyle: {
    // your styles for the link
    padding: 10,
    backgroundColor: "#FF2400",
    borderRadius: 5,
  },
  Cancelbuton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailBoldValue: {
    width: "90%",
    fontSize: 18,
    fontWeight: "bold",
    padding: 5,
    color: "#333",
  },
  detailValuemono: {
    width: "90%",
    fontSize: 18,
    fontFamily: "monospace",
    padding: 5,
    color: "#333",
  },
  buttonContainer: {
    marginHorizontal: 80, // Adjusts the horizontal margin to avoid full width
    marginVertical: 10, // Adds some vertical space
  },
  button: {
    elevation: 2, // Adds a slight shadow for Android
    borderRadius: 20, // Rounded corners
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 12, // Horizontal padding
    shadowOffset: { width: 1, height: 1 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 1.41, // Shadow blur radius for iOS
  },
  text: {
    color: "white", // Text color
    textAlign: "center", // Centers the text
    fontSize: 16, // Text size
    fontWeight: "bold", // Text weight
  },
});
