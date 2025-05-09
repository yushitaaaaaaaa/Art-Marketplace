import { useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons'; 

const API_URL = 'http://192.168.29.34:4545/api';

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();
  const otpRef = useRef(null);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const sendOtp = async () => {
    try {
      if (!phone || phone.length !== 10 || isNaN(phone)) {
        Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
        return;
      }
      setLoading(true);
      const res = await axios.post(`${API_URL}/send-otp`, { phone });
      if (res.status === 200) {
        setOtpSent(true);
        setTimeout(() => otpRef.current?.focus(), 300);
        Alert.alert('OTP Sent', `OTP has been sent to +91${phone}`);
      }
    } catch (err) {
      console.error('OTP Error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      if (!otp || otp.length < 6) {
        Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
        return;
      }
      setLoading(true);
      const res = await axios.post(`${API_URL}/verify-otp`, { phone, code: otp });
      if (res.status === 200 && res.data.user) {
        login(res.data.user);
        Alert.alert('Success', 'You are now logged in!', [
          { text: 'Continue', onPress: () => navigation.navigate('Home') }
        ]);
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
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../assets/logo.jpg')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.greeting}>Welcome to Art MarketPlace!</Text>
            <Text style={styles.subGreeting}>Login in to continue shopping</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="call" size={22} color="#2e8b83" />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    placeholder="Enter 10-digit phone number"
                    placeholderTextColor="#aaa"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    editable={!loading}
                  />
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={sendOtp} 
              style={styles.button} 
              disabled={loading || (otpSent && timer > 0)}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {otpSent ? `Resend OTP (${timer})` : 'Send OTP'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {otpSent && (
            <View style={[styles.card, styles.otpCard]}>
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons name="lock-closed" size={22} color="#2e8b83" />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>OTP Verification</Text>
                  <TextInput
                    placeholder="Enter 6-digit OTP"
                    ref={otpRef}
                    secureTextEntry={true}
                    placeholderTextColor="#aaa"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    style={styles.otpInput}
                    editable={!loading}
                  />
                </View>
              </View>
              
              <TouchableOpacity 
                onPress={verifyOtp} 
                style={styles.button} 
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Login</Text>
                )}
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
    backgroundColor: '#f8f9fa',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
  },
    logoImage: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d3d3b',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    color: '#2e8b83',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  otpCard: {
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    marginRight: 15,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontWeight: '600',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    backgroundColor: '#fefefe',
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2e8b83',
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#2e8b83',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});