import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Art Marketplace 🎨</Text>
      <Text style={styles.subText}>Discover and shop beautiful handmade art pieces!</Text>
      <Button 
        title="Explore Shop" 
        onPress={() => navigation.navigate('Shop')} 
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subText: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
});
