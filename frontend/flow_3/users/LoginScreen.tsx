import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { CreateUserDto } from './CreatedUsersDto';
import { login } from './usersSlice';
import { AppDispatch, RootState } from '@/flow_2/slices/store';
import { Input, InputField } from '@/components/ui/input';

interface LoginScreenProps {}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { width: screenWidth } = Dimensions.get("window");
    const dispatch = useDispatch<AppDispatch>()
    const error = useSelector((state: RootState) => state.user.errormessage)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    dispatch(login(new CreateUserDto(username, password)))
  };

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text>Login</Text>
      {error && <Text>{error}</Text>}

      {/* Custom Input for Email */}
      <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false}>
        <InputField
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
        />
      </Input>

      {/* Custom Input for Password */}
      <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false}>
        <InputField
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
      </Input>

      {/* Custom Button */}
      <Button size="xl" variant="solid" action="primary" onPress={handleSubmit} accessibilityLabel="Login Button">
        <ButtonText>Login</ButtonText>
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 20,
    paddingTop: 200,
  },
});