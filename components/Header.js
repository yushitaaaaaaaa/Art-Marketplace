import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const Header = ({ title }) => (
  <View style={styles.headerContainer}>
    <StatusBar backgroundColor="#ff6f61" barStyle="light-content" />
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 45,
    paddingBottom: 15,
    backgroundColor: '#ff6f61',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
});

export default Header;