import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Header from '../components/Header';

const CartScreen = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user || !user._id) {
      Alert.alert('Login Required', 'Please login to place an order.');
      return;
    }

    try {
      setLoading(true);
      const order = {
        userId: user._id,
        products: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
        })),
        totalAmount: total,
      };

      await axios.post('http://192.168.29.34:4545/api/orders', order);
      Alert.alert('Success', 'Your order has been placed!');
      clearCart();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Cart" />
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <Text style={styles.quantity}>Qty: {item.quantity}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ₹{total}</Text>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <TouchableOpacity style={styles.clearButton} onPress={handlePlaceOrder}>
                <Text style={styles.clearText}>Place Order</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.clearButton, { backgroundColor: 'red', marginTop: 10 }]} onPress={clearCart}>
              <Text style={styles.clearText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#777' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginBottom: 10
  },
  image: { width: 70, height: 70, borderRadius: 10 },
  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#6200EE' },
  remove: { color: 'red', fontWeight: 'bold' },
  list: { paddingBottom: 100 },
  footer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 10
  },
  total: { fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
  clearButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  clearText: { color: '#fff', fontWeight: 'bold' },
  quantity: { fontSize: 14, color: '#555' }
});

export default CartScreen;
