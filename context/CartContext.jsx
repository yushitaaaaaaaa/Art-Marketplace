import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cartItems');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (err) {
        console.error('Failed to load cart from storage', err);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (err) {
        console.error('Failed to save cart to storage', err);
      }
    };
    saveCart();
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find(item => item.id === product.id);
  
      if (exists) {
        if (exists.quantity >= product.stock) {
          Alert.alert('Stock Limit Reached', `Only ${product.stock} in stock.`);
          return prev; 
        }
        Alert.alert('Added to Cart', `${product.name} quantity increased.`);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        if (product.stock <= 0) {
          Alert.alert('Out of Stock', `${product.name} is not available.`);
          return prev; 
        }
        Alert.alert('Added to Cart', `${product.name} added to cart.`);
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };
  

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

