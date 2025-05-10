import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { useCart } from '../context/CartContext';
import { Alert } from 'react-native';

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const { addToCart } = useCart(); 

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert("Success", `${product.name} has been added to your cart.`);
  };

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.stock}>In Stock: {product.stock}</Text>
      <Button title="Add to Cart" onPress={() => handleAddToCart(product)}  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#ff6f61',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  stock: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ProductDetailsScreen;

