import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './flow_1/utils/types';
import EditScreen from './flow_2/EditCategory';
import Category from './flow_1/Category';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <GluestackUIProvider mode="light">
        <View style={styles.container}>
          <Category />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </View>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: 'tomato' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Category List',
          headerTintColor: "white"
        }
        }
      />
      <Stack.Screen
        name="Edit"
        component={EditScreen}
        options={{
          title: 'Edit',
          headerTintColor: "white"
        }}
      />
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});