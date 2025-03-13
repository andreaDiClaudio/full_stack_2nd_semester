import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './flow_1/utils/types';
// Screens
import Category from './flow_1/Home';
import CreateCategoryScreen from './flow_2/CreateCategory';
import DeleteCategoryScreen from './flow_2/DeleteCategory';
import CreateEntryScreen from './flow_2/CreateEntry';
import { Provider } from 'react-redux';
import { store } from './flow_2/slices/store';
import EditScreen from './flow_2/Edit';

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

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: 'tomato' },
        headerTintColor: "white"
      }}
    >
      <Stack.Screen name="Home" component={MyTabs} />
      <Stack.Screen 
        name="Edit" 
        component={EditScreen} 
        options={({ route }) => ({
          title: route.params?.entityType === 'category' ? 'Edit Category' : 'Edit Entry'
        })}
      />
      <Stack.Screen name="Delete" component={DeleteCategoryScreen} options={{ title: 'Delete Category' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
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
