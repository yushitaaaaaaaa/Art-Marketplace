import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const { user, logout, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [age, setAge] = useState(user?.age?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setName(parsedUser.name || "");
        setEmail(parsedUser.email || "");
        setAge(parsedUser.age?.toString() || "");
      }
    };
    loadUser();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axios.get(`http://192.168.29.34:4545/api/orders/${user.phone}`);
      console.log('Fetched orders:', res.data);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = { phone: user.phone, name, email, age: parseInt(age) || 0 };
      await axios.put("http://192.168.29.34:4545/api/update-profile", updated);
      setUser((prevUser) => ({
        ...prevUser,
        name,
        email,
        age: parseInt(age) || 0,
      }));

      await AsyncStorage.setItem("user", JSON.stringify({
        ...user,
        name,
        email,
        age: parseInt(age) || 0,
      }));
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAge(user?.age?.toString() || "");
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            logout();
            Alert.alert("Logged Out", "You have been logged out successfully.");
          },
          style: "destructive"
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}> 
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="#2e8b83" />
          </View>
          <Text style={styles.welcomeText}>
            Hello, {name || user?.phone || "User"}
          </Text>
          <Text style={styles.phoneText}>
            {user?.phone ? `+91 ${user.phone}` : ""}
          </Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!isEditing && (
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={handleEdit}
              >
                <Ionicons name="create-outline" size={18} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={[styles.inputContainer, !isEditing && styles.readOnlyInput]}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={name} 
                onChangeText={setName} 
                placeholder="Enter your name" 
                placeholderTextColor="#aaa"
                editable={isEditing}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, !isEditing && styles.readOnlyInput]}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                placeholder="Enter your email" 
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                editable={isEditing}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <View style={[styles.inputContainer, !isEditing && styles.readOnlyInput]}>
              <Ionicons name="calendar-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={age} 
                onChangeText={setAge} 
                placeholder="Enter your age" 
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={3}
                editable={isEditing}
              />
            </View>
          </View>
          
          {isEditing && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={18} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order History</Text>
          
          {loadingOrders ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2e8b83" />
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyOrders}>
              <Ionicons name="cart-outline" size={50} color="#ccc" />
              <Text style={styles.emptyOrdersText}>No orders yet</Text>
              <Text style={styles.emptyOrdersSubText}>Your order history will appear here</Text>
            </View>
          ) : (
            orders.map((order, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                  <View style={styles.orderStatus}>
                    <Text style={styles.orderStatusText}>{order.status || 'Pending'}</Text>
                  </View>
                </View>
                
                <View style={styles.orderDetails}>
                  <Text style={styles.orderItems}>
                    {order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.orderTotal}>
                    Total: ₹{order.totalAmount || 0}
                  </Text>
                </View>
              </View>
          )))}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1d3d3b",
  },
  phoneText: {
    fontSize: 14,
    color: "#1d3d3b",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1d3d3b",
  },
  editButton: {
    backgroundColor: "#ff4d4d",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 6,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
  },
  readOnlyInput: {
    backgroundColor: "#f0f0f0",
    borderColor: "#e0e0e0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4caf50",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyOrders: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyOrdersText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginTop: 10,
  },
  emptyOrdersSubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  orderItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,7
    borderLeftColor: "#2e8b83",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  orderStatus: {
    borderColor: "#ff4d4d",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderStatusText: {
    fontSize: 12,
    color: "#ff4d4d",
    fontWeight: "500",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItems: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2e8b83",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  }
});

export default ProfileScreen;