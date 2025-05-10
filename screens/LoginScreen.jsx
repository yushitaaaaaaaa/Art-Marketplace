import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://192.168.29.34:4545';

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const sendOtp = async () => {
    try {

      if (!phone || phone.length !== 10 || isNaN(phone)) {
        Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
        return;
      }
      setLoading(true);
      const res = await axios.post(`${API_URL}/send-otp`, { phone });
      
      setLoading(true);
      const res = await axios.post(`${API_URL}/verify-otp`, { phone, code: otp });
      if (res.status === 200 && res.data.user) {
        login(res.data.user);

        Alert.alert('Success', 'You are now logged in!');
      }
    } catch (err) {
      console.error('Verify Error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'OTP verification failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
      <Header title="Login" />
        <View style={styles.container}>
          <Text style={styles.heading}>Welcome!!</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="10-digit mobile number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              editable={!loading}
            />
            <TouchableOpacity onPress={sendOtp} style={styles.button} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
            </TouchableOpacity>
          </View>

          {otpSent && (
            <View style={styles.card}>
              <Text style={styles.label}>OTP</Text>
              <TextInput
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                editable={!loading}
              />

              <TouchableOpacity onPress={verifyOtp} style={styles.button} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6f61',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fefefe',
  },
  button: {
    backgroundColor: '#ff6f61',
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

