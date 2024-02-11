import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Loading from "../LoadingView";
import { BACKEND_API_URL } from "@env";
import { React, useState, useEffect } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setRefreshing(true);
    setError(null); // Resetting any previous errors

    try {
      const token = await AsyncStorage.getItem("authToken");
      const apiUrl = BACKEND_API_URL;

      // Fetching orders
      const response = await axios.post(
        `${apiUrl}/api/packing/status`,

        {
          orderId: params.id, // Payload for the POST request
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data) {
        // If response contains data
        setData(response.data);
      } else {
        // If response is empty
        setData([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the error is a 404, set data to an empty array
        setData([]);
      } else {
        // For other errors, log and set the error state
        console.error("Error fetching data:", error);
        setError(error);
        setData(null);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Link
            href={{
              pathname: "/packing",
            }}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </Link>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order {params.id}</Text>
      </View>
      <View style={styles.itemContainer}>
        <View style={styles.ContainerbackgroundColor}>
          <View style={styles.itemHeaderView}>
            <Text style={styles.orderId}>
              Order Status:
              <Text>
                {"  "}
                {
                  isLoading ? (
                    "Loading..." // Display this text while loading
                  ) : data && data.progress ? (
                    <View style={styles.ResponseContainer}>
                      <Text style={styles.Response}>{data.progress}</Text>
                    </View>
                  ) : (
                    // Display the progress if available
                    <View style={styles.NotStartedContainer}>
                      <Text style={styles.NotStarted}> Not Started</Text>
                    </View>
                  ) // Default text if not loading and data is either empty or doesn't have progress
                }{" "}
              </Text>
            </Text>
          </View>
          <View style={styles.itemHeaderView}>
            <Text style={styles.orderId}>Order ID: </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  itemHeaderView: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,

    marginVertical: 5,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF", // iOS style blue
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dummyText: {
    fontSize: 18,
  },
  itemContainer: {
    flex: 1,
    paddingLeft: 10,
    padding: 5,
    marginBottom: 10,
    fontSize: 24,
    backgroundColor: "#e6e6e6",
  },
  NotStarted: {
    color: "#e6e6e6",
    marginRight: 10,
    marginLeft: 10,
  },
  NotStartedContainer: {
    backgroundColor: "#ff0000",
    borderRadius: 5,
    justifyContent: "center",
    akignItems: "center",
  },
  Response: {
    color: "#e6e6e6",
    marginRight: 10,
    marginLeft: 10,
  },
  ResponseContainer: {
    backgroundColor: "#FFA500",
    borderRadius: 5,
    justifyContent: "center",
    akignItems: "center",
    marginLeft: 10,
  },

  // Add styles for your line items here
});
