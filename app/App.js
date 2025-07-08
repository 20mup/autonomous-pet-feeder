import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './app/screens/ProfileScreen';
import HomeScreen from './app/screens/HomeScreen';
import EditPetScreen from './app/screens/EditPetScreen';
import MainMenuScreen from './app/screens/MainMenuScreen';
import FoodStorageScreen from './app/screens/FoodStorageScreen';
import ViewPetsScreen from './app/screens/ViewPetsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} options={{ headerShown: true }} />
        <Stack.Screen name="FoodStorage" component={FoodStorageScreen} />
        <Stack.Screen name='ViewPets' component={ViewPetsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditPet" component={EditPetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
