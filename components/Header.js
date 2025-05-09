import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const Header = ({ title }) => (
  <View style={styles.headerContainer}>
    <StatusBar backgroundColor="#2e8b83" barStyle="light-content" />
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 45,
    paddingBottom: 15,
    backgroundColor: '#2e8b83',
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
  },
});

export default Header;

