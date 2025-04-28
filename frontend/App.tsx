import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './flow_1/utils/types';
// Screens
import Category from './flow_1/Home';
import CreateCategoryScreen from './flow_2/CreateCategory';
import CreateEntryScreen from './flow_2/CreateEntry';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from './flow_2/slices/store';
import EditCategoryScreen from './flow_2/EditCategory';
import EditEntryScreen from './flow_2/EditEntry';
import { LoginScreen } from './flow_3/users/LoginScreen';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { logout, reloadJwtFromStorage } from './flow_3/users/usersSlice';
import { SignupScreen } from './flow_3/users/SignupScreen';

// Create Stack and Tab Navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

function AuthScreenWrapper() {
  return (
    <View style={styles.screenContainer}>
      <GluestackUIProvider mode="light">
        <View style={styles.contentContainer}>
          <LoginScreen />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </View>
  );
}

function SignupScreenWrapper() {
  return (
    <View style={styles.screenContainer}>
      <GluestackUIProvider mode="light">
        <View style={styles.contentContainer}>
          <SignupScreen />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </View>
  );
}

function AuthScreens() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={AuthScreenWrapper} />
      <AuthStack.Screen name="SignupScreen" component={SignupScreenWrapper} />
    </AuthStack.Navigator>
  );
}

function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <GluestackUIProvider mode="light">
        <View style={styles.contentContainer}>
          <Category />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </View>
  );
}

function CreateCategoryScreenWrapper() {
  return (
    <View style={styles.screenContainer}>
      <GluestackUIProvider mode="light">
        <View style={styles.contentContainer}>
          <CreateCategoryScreen />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </View>
  );
}

function EditCategoryScreenWrapper() {
  return (
    <View style={styles.screenContainer}>
      <GluestackUIProvider mode="light">
        <View style={styles.contentContainer}>
          <EditCategoryScreen />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </View>
  );
}

function EditEntryScreenWrapper() {
  return (
    <View style={styles.screenContainer}>
      <GluestackUIProvider mode="light">
        <View style={styles.contentContainer}>
          <EditEntryScreen />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </View>
  );
}

function EntriesScreenWrapper() {
  return (
    <View style={styles.screenContainer}>
      <GluestackUIProvider mode="light">
        <View style={styles.contentContainer}>
          <CreateEntryScreen />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </View>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ headerShown: false, tabBarLabel: 'Home' }}
      />
      <Tab.Screen name="Category" component={CreateCategoryScreenWrapper} options={{ headerShown: false }} />
      <Tab.Screen name="Entry" component={EntriesScreenWrapper} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function RootStack({ dispatch }: { dispatch: any }) {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: 'tomato' },
        headerTintColor: "white"
      }}
    >
      <Stack.Screen name="Home" component={MyTabs} options={({ navigation }) => ({
          title: 'Home', // nice clean title
          headerRight: () => (
            <Button
              title="Logout"
              onPress={() => {
                dispatch(logout()); 
              }}
              color="#fff" // white text on tomato background
            />
          )
        })}
      />
      <Stack.Screen name="EditCategory" component={EditCategoryScreenWrapper} options={{ title: 'Edit Category' }} />
      <Stack.Screen name="EditEntry" component={EditEntryScreenWrapper} options={{ title: 'Edit Entry' }} />
    </Stack.Navigator>
  );
}

function MainApp() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    async function getToken() {
      const storedToken = await SecureStore.getItemAsync('jwt');
      if (storedToken) {
        dispatch(reloadJwtFromStorage(storedToken)); // FIXED
      }
      setLoading(false);
    }
    getToken();
  }, [dispatch]);

  if (loading) return null; // Or a splash screen

  return (
    <NavigationContainer>
      {token ? <RootStack dispatch={dispatch}/> : <AuthScreens />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
