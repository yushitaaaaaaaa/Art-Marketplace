import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import products from '../data/Products';

const ShopScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shop Artworks 🛒</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  info: { flex: 1 },
  title: { fontSize: 18 },
  price: { fontSize: 16, color: 'gray' },
});
