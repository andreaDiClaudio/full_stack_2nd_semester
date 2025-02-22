import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './flow_1/utils/types';

// Screens
import EditScreen from './flow_2/EditCategory';
import Category from './flow_1/Category';
import CreateCategoryScreen from './flow_2/CreateCategory';
import DeleteScreen from './flow_2/DeleyeCategory';

// Create Stack and Tab Navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

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

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Categories" component={HomeScreen}  options={{ headerShown: false }}  />
      <Tab.Screen name="Create" component={CreateCategoryScreenWrapper}  options={{ headerShown: false }}  />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: 'tomato' },
        headerTintColor: "white"
      }}
    >
      <Stack.Screen name="Home" component={MyTabs} options={{ title: 'Categories' }} />
      <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Edit' }} />
      <Stack.Screen name="Delete" component={DeleteScreen} options={{ title: 'Delete' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
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
