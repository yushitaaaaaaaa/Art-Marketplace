import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Cart is Empty 🛍️</Text>
      <Button 
        title="Start Shopping" 
        onPress={() => navigation.navigate('Shop')} 
      />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 22, marginBottom: 20 },
});
