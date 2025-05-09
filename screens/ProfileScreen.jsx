import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile 👤</Text>
      <Text style={styles.label}>Name: Yushita Kalra</Text>
      <Text style={styles.label}>Email: yushita@example.com</Text>
      <Button title="Edit Profile" onPress={() => {}} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 18, marginBottom: 10 },
});
