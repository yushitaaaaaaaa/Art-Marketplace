import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_URL = '{YOUR_IPv4_ADDRESS}/api';

const CartScreen = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
  if (!user) {
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
        quantity: item.quantity
      })),
      totalAmount: total
    };

    console.log('Sending order:', JSON.stringify(order));
    
    const response = await axios.post('http://192.168.29.34:4545/api/orders', order);
    console.log('Order response:', response.data);
    
    Alert.alert('Success', 'Your order has been placed!');
    clearCart();
  } catch (error) {
    console.error('Order error:', error.response?.data || error.message);
    Alert.alert('Error', 'Failed to place order. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Add items to get started!</Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantity}>Qty: {item.quantity}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
            
            <View style={styles.buttonsContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#2e8b83" />
              ) : (
                <TouchableOpacity 
                  style={styles.placeOrderButton} 
                  onPress={handlePlaceOrder}
                >
                  <Text style={styles.buttonText}>Place Order</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={clearCart}
              >
                <Text style={styles.clearText}>Clear Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#777',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: { 
    width: 80, 
    height: 80, 
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  info: { 
    flex: 1, 
    marginLeft: 15,
  },
  name: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  price: { 
    fontSize: 18, 
    color: '#2e8b83',
    fontWeight: '600',
    marginBottom: 6,
  },
  quantityContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  quantity: { 
    fontSize: 14, 
    color: '#555',
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2e8b83',
  },
  removeText: { 
    color: '#2e8b83', 
    fontWeight: '600',
    fontSize: 14,
  },
  list: { 
    paddingTop: 10,
    paddingBottom: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: { 
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#333',
  },
  buttonsContainer: {
    gap: 12,
  },
  placeOrderButton: {
    backgroundColor: '#2e8b83',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearText: { 
    color: '#777', 
    fontWeight: '600',
    fontSize: 16,
  },
  shopNowButton: {
  marginTop: 20,
  paddingVertical: 12,
  paddingHorizontal: 24,
  backgroundColor: '#2e8b83',
  borderRadius: 12,
},
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
