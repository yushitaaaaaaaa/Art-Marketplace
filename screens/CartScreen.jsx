import React from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text>₹{item.price} x {item.quantity}</Text>
                  <Button title="Remove" color="red" onPress={() => removeFromCart(item.id)} />
                </View>
              </View>
            )}
          />
          <Text style={styles.total}>Total: ₹{getTotal()}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  emptyText: { fontSize: 18, textAlign: 'center', marginTop: 50 },
  item: { flexDirection: 'row', marginVertical: 10, backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginTop: 20 },
});

export default CartScreen;
