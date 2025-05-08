import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`http://192.168.29.34:4545/orders/${user.phone}`).then((res) => {
        setOrders(res.data);
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    Alert.alert("Logged Out", "You have been logged out.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{user?.phone}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Order History</Text>
        {orders.length === 0 ? (
          <Text style={styles.value}>No orders yet</Text>
        ) : (
          orders.map((order, index) => (
            <Text key={index} style={styles.value}>
              {order.items.length} items | {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  value: { fontSize: 16, color: "#333" },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#ff6f61",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
