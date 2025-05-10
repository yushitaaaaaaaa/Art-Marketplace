// import React from 'react';
// import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import products from '../data/Products';

// const ShopScreen = ({ navigation }) => {
//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.productContainer}
//       onPress={() => navigation.navigate('ProductDetails', { product: item })}
//     >
//       <Image source={item.image} style={styles.image} />
//       <Text style={styles.name}>{item.name}</Text>
//       <Text style={styles.price}>₹{item.price}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         numColumns={2}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//   },
//   productContainer: {
//     flex: 1,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     alignItems: 'center',
//     elevation: 3,
//   },
//   image: {
//     width: 120,
//     height: 120,
//     borderRadius: 10,
//   },
//   name: {
//     fontWeight: 'bold',
//     marginTop: 5,
//     textAlign: 'center',
//   },
//   price: {
//     color: '#ff6f61',
//     marginTop: 5,
//   },
// });

// export default ShopScreen;

