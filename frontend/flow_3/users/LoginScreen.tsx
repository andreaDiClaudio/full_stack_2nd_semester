import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { CreateUserDto } from './CreatedUsersDto';
import { login } from './usersSlice';
import { AppDispatch, RootState } from '@/flow_2/slices/store';
import { Input, InputField } from '@/components/ui/input';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types';

interface LoginScreenProps {}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { width: screenWidth } = Dimensions.get("window");
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: RootState) => state.user.errormessage);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null); // For form-level error handling
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();

  const handleSubmit = async () => {
    if (username === '' || password === '') {
      setFormError("Both username and password are required.");
      return; // Prevent submission if fields are empty
    }

    setFormError(null); // Clear any previous error
    dispatch(login(new CreateUserDto(username, password))); // Dispatch login action
  };

  const goToSignup = () => {
    navigation.navigate('SignupScreen');
  };

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text>Login</Text>
      
      {/* Show form-level validation error */}
      {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

      {/* Show redux-level error if present */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Custom Input for Username */}
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

      <TouchableOpacity onPress={goToSignup} style={styles.container}>
        <Text style={styles.signupLink}>Don't have an account?</Text>
        <Text style={styles.signupLink}>Sign up</Text>
      </TouchableOpacity>
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
  signupLink: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
