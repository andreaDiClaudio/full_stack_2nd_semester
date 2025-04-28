import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CreateUserDto } from './CreatedUsersDto';
import { login } from './usersSlice';
import { AppDispatch, RootState } from '@/flow_2/slices/store';

interface LoginScreenProps {}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>()
    const error = useSelector((state: RootState) => state.user.errormessage)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    dispatch(login(new CreateUserDto(email, password)))
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Text>{error}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
      />
      <Button title="Login" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});