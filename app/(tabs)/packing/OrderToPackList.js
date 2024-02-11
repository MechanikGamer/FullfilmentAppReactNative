import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";
import Loading from "../../LoadingView";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_API_URL } from "@env";
import OrderToPackItem from "./OrderToPackItem";

const OrderToPackList = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const apiUrl = BACKEND_API_URL;

      // Fetching orders
      const ordersResponse = await axios.get(
        `${apiUrl}/api/orders/processing-orders`,
        {
          headers: {
            token: token,
          },
        }
      );

      // Check if there are no orders or a specific message is returned
      if (ordersResponse.data.length === 0 || ordersResponse.data.message) {
        setData([]); // Ensures the list is empty
        setError(ordersResponse.data.message || "No orders to pack"); // Set the error state to display the message
      } else {
        setData(ordersResponse.data); // Set data if orders exist

        // Extract SKUs from fetched orders if any
        const extractedSkus = ordersResponse.data.reduce((acc, order) => {
          const orderSkus = order.line_items.map((item) => item.sku);
          return [...acc, ...orderSkus];
        }, []);

        // Fetch product details for each SKU
        const productDetailsResponse = await axios.post(
          `${apiUrl}/api/orders/product-details`,
          {
            skus: extractedSkus,
          },
          {
            headers: {
              token: token,
            },
          }
        );

        setProductDetails(productDetailsResponse.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.listEmptyComponent}>
        {isLoading ? (
          <Loading />
        ) : (
          <Text style={styles.noOrdersText}>
            {error || "No orders to pack"}
          </Text>
        )}
      </View>
    );
  };

  const onRefresh = () => {
    fetchData(); // Call the fetchData function which fetches data and updates the refreshing state
  };

  const renderItem = ({ item }) => {
    return (
      <OrderToPackItem
        style={styles.renderItem}
        data={item} // The entire order data
        productDetails={productDetails} // Pass the product details for lookup
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        initialNumToRender={10} // Number of items to render in the initial batch
        maxToRenderPerBatch={10}
        windowSize={5}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={listEmptyComponent} // Render empty component when list is empty
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default OrderToPackList;

const styles = StyleSheet.create({
  // ... other styles
  noOrdersText: {
    textAlign: "center", // Center the text
    margin: 20, // Add some margin
    fontSize: 18,
  },
  listEmptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  // ... other styles
});
