import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.stock}>In Stock: {product.stock}</Text>

      <Button 
        title="Add to Cart" 
        onPress={() => {
          alert('Added to cart 🛒 (dummy)');
          navigation.navigate('Cart');
        }} 
      />
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  image: { width: '100%', height: 300, borderRadius: 10, marginBottom: 20 },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
  category: { fontSize: 18, color: 'gray', marginBottom: 10 },
  price: { fontSize: 22, fontWeight: '600', color: 'green', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  stock: { fontSize: 16, color: 'tomato', marginBottom: 20 },
});
