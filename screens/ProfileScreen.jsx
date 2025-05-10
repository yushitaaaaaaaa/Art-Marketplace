import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Header from '../components/Header';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [age, setAge] = useState(user?.age?.toString() || "");


  useEffect(() => {
    if (user) {
      axios.get(`http://192.168.29.34:4545/orders/${user.phone}`).then((res) => {
        setOrders(res.data);
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const updated = { phone: user.phone, name, email, age };
      await axios.put("http://192.168.29.34:4545/update-profile", updated);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout();
    Alert.alert("Logged Out", "You have been logged out.");
  };

  return (

    <ScrollView style={styles.container}>
      <Header title="Profile" />
      <Text style={styles.heading}>👤 My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>📱 Phone Number</Text>
        <Text style={styles.value}>{user?.phone}</Text>

        <Text style={styles.label}>🙍‍♀️ Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />

        <Text style={styles.label}>📧 Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" />

        <Text style={styles.label}>🎂 Age</Text>
        <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Enter your age" keyboardType="numeric" />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🛍️ Order History</Text>
        {orders.length === 0 ? (
          <Text style={styles.value}>No orders yet</Text>
        ) : (
          orders.map((order, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.value}>
                {order.items.length} item(s) | {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f4f5",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orderItem: {
    marginTop: 6,
  },
});
