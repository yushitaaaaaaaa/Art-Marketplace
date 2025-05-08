import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import products from '../data/Products';
import Header from '../components/Header';

const { height, width } = Dimensions.get('window');


const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('name');

  const categories = ['All', ...new Set(products.map((item) => item.category))];

  const filteredData = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption === 'price') return a.price - b.price;
    return a.name.localeCompare(b.name);
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Home" />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sortOption}
          onValueChange={(value) => setSortOption(value)}
          style={styles.picker}
        >
          <Picker.Item label="Sort by Name" value="name" />
          <Picker.Item label="Sort by Price" value="price" />
        </Picker>
      </View>

      <View style={styles.productListContainer}>
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: height * 0.1,
    justifyContent: 'center',
  },
  searchContainer: {
    height: height * 0.1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  categoriesContainer: {
    height: height * 0.05,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  pickerContainer: {
    height: height * 0.15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  picker: {
    width: 200,
  },
  productListContainer: {
    height: height * 0.5,
    paddingHorizontal: 10,
  },
  productList: {
    paddingBottom: 20,
  },
  productItem: {
    flex: 1,
    margin: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 13,
    color: 'green',
    marginTop: 4,
  },
});

export default HomeScreen;
