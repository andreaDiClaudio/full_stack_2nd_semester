import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { CreateUserDto } from './CreatedUsersDto';
import { signup } from './usersSlice'; // Assuming you have a signup action in usersSlice
import { AppDispatch, RootState } from '@/flow_2/slices/store';
import { Input, InputField } from '@/components/ui/input';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types'; // Adjust this based on your project

interface SignupScreenProps {}

export const SignupScreen: React.FC<SignupScreenProps> = () => {
  const { width: screenWidth } = Dimensions.get("window");
  const dispatch = useDispatch<AppDispatch>()
  const error = useSelector((state: RootState) => state.user.errormessage) // Assuming error is managed in Redux
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SignupScreen'>>();
  const [formError, setFormError] = useState<string | null>(null); //

    // Redirect user on successful signup
    useEffect(() => {
      if (!error && username && password) {
        // If there's no error, and the user has entered a valid username and password
        navigation.navigate('Login');
      }
    }, [error, navigation]);
  
    const handleSubmit = async () => {
      if (username === '' || password === '' || confirmPassword === '') {
        setFormError("All fields are required.");
        return; // Prevent submission if fields are empty
      }
  
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return; // Prevent submission if passwords don't match
      }
  
      setFormError(null); // Clear any previous error
      dispatch(signup(new CreateUserDto(username, password))); // Dispatch signup action
    };

  return (
    <View style={[styles.container, { width: screenWidth * 0.8 }]}>
      <Text>Sign Up</Text>
      {formError && <Text style={styles.errorText}>{formError}</Text>}


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

      {/* Custom Input for Confirm Password */}
      <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false}>
        <InputField
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          placeholder="Confirm Password"
          autoCapitalize="none"
        />
      </Input>

      {/* Custom Button for Signup */}
      <Button size="xl" variant="solid" action="primary" onPress={handleSubmit} accessibilityLabel="Signup Button">
        <ButtonText>Sign Up</ButtonText>
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
  signupLink: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline', // Make it look like a link
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
