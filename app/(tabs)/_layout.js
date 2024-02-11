import { Tabs } from "expo-router";
import {
  Entypo,
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="#008E97" />
            ) : (
              <AntDesign name="home" size={24} color="#008E97" />
            ),
        }}
      />
      <Tabs.Screen
        name="goodsreceiv"
        options={{
          tabBarLabel: "Goods Receiving",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="receipt" size={24} color="#008E97" />
            ) : (
              <Ionicons name="receipt-outline" size={24} color="#008E97" />
            ),
        }}
      />
      <Tabs.Screen
        name="picking"
        options={{
          tabBarLabel: "Picking",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="scan-circle" size={24} color="#008E97" />
            ) : (
              <MaterialCommunityIcons
                name="barcode-scan"
                size={24}
                color="#008E97"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="packing"
        options={{
          tabBarLabel: "Packing",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="package-down"
                size={24}
                color="#008E97"
              />
            ) : (
              <Feather name="package" size={24} color="#008E97" />
            ),
        }}
      />
    </Tabs>
  );
}
