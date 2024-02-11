import { StyleSheet, View } from "react-native";
import React from "react";
import PackingHeader from "./PackingHeader";
import OrderToPackList from "./OrderToPackList";

const index = () => {
  return (
    <View style={styles.container}>
      <View style={styles.HeaderContainer}>
        <PackingHeader />
      </View>
      <View style={styles.ListContainer}>
        <OrderToPackList />
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  HeaderContainer: {
    flex: 1,
  },
  ListContainer: {
    flex: 8,
    height: 100,
  },
});
