// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const API_URL = 'http://192.168.29.34:4545';

// export const LoginScreen = () => {
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState(1);
//   const { login } = useAuth();

//   const handleSendOtp = async () => {
//     try {
//       await axios.post(`${API_URL}/send-otp`, { phone });
//       Alert.alert('OTP Sent', 'Check your messages for the OTP');
//       setStep(2);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to send OTP');
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       const response = await axios.post(`${API_URL}/verify-otp`, { phone, code: otp });
//       if (response.data.message === 'Phone verified') {
//         login(response.data.user); // Save the returned user to context
//       } else {
//         Alert.alert('Invalid OTP', 'Please try again');
//       }
//     } catch (err) {
//       console.error(err.response?.data || err);
//       Alert.alert('Error', 'Verification failed');
//     }
//   };
  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>OTP Login</Text>
//       {step === 1 ? (
//         <>
//           <TextInput
//             placeholder="Enter Phone Number"
//             keyboardType="phone-pad"
//             value={phone}
//             onChangeText={setPhone}
//             style={styles.input}
//           />
//           <Button title="Send OTP" onPress={handleSendOtp} />
//         </>
//       ) : (
//         <>
//           <TextInput
//             placeholder="Enter OTP"
//             keyboardType="numeric"
//             value={otp}
//             onChangeText={setOtp}
//             style={styles.input}
//           />
//           <Button title="Verify OTP" onPress={handleVerifyOtp} />
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   input: {
//     borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5
//   }
// });
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// Use your actual backend URL (for physical device testing, replace localhost with your computer's IP)
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
      // Validate phone number
      if (!phone || phone.length !== 10 || isNaN(phone)) {
        Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
        return;
      }

      setLoading(true);
      const res = await axios.post(`${API_URL}/send-otp`, { phone });
      
      if (res.status === 200) {
        setOtpSent(true);
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
      if (!otp || otp.length < 4) {
        Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
        return;
      }

      setLoading(true);
      const res = await axios.post(`${API_URL}/verify-otp`, { 
        phone, 
        code: otp 
      });

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Art Marketplace</Text>
  
          <View style={styles.wrapper}>
            <Text style={styles.label}>Enter Phone Number</Text>
            <TextInput
              placeholder="10-digit mobile number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={sendOtp} 
              style={styles.button}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>
  
          {otpSent && (
            <View style={styles.wrapper}>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                placeholder="6-digit OTP"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={verifyOtp} 
                style={styles.button}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  heading: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center',
    color: '#ff6f61'
  },
  wrapper: { 
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd',
    padding: 15, 
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  button: { 
    backgroundColor: '#ff6f61', 
    padding: 15, 
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10
  },
  btnText: { 
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
});