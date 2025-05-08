import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CartScreen = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = async () => {
    try {
      if (!user || !user._id) {
        Alert.alert('Login Required', 'Please login to place an order.');
        return;
      }

      const order = {
        userId: user._id,
        products: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
        })),
        totalAmount,
      };

      await axios.post('http://localhost:4545/api/orders', order);
      Alert.alert('Success', 'Your order has been placed!');
      clearCart();
    } catch (err) {
      Alert.alert('Error', 'Failed to place order');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <Button title="Remove" onPress={() => removeFromCart(item.id)} />
          </View>
        )}
      />
      <Text style={styles.total}>Total: ₹{totalAmount}</Text>
      <Button title="Place Order" onPress={handlePlaceOrder} disabled={!cartItems.length} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: {
    backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, marginBottom: 10
  },
  name: { fontSize: 16 },
  price: { fontSize: 16, color: '#ff6f61' },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 }
});

export default CartScreen;
