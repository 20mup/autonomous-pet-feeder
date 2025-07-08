import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Ably from 'ably';

const ably = new Ably.Realtime.Promise('f16LJw.X_qNDQ:so3HWdPvjwXvw9qk1qTlfqJsZJ1H9B6rQGCUhzleYpE')
const channel = ably.channels.get('Instructions'); 

const ProfileScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({
    name: '',
    animal: '',
    breed: '',
    age: '',
    foodAmount: '',
    feedingTimes: '',
    feedingSchedule: [],
  });

  // Function to load pets from AsyncStorage
  useEffect(() => {
    const loadPets = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@pets');
        setPets(jsonValue != null ? JSON.parse(jsonValue) : []);
      } catch (e) {
        Alert.alert('Error', 'Failed to load pets.');
      }
    };
    useEffect(() => {
      const instructionsChannel = ably.channels.get('Instructions');
    
      // Attach to the channel
      instructionsChannel.attach(err => {
        if (err) {
          console.error('Could not attach to the instructions channel:', err);
        }
      });
    
      // Subscribe to messages
      instructionsChannel.subscribe(message => {
        data = JSON.parse(message.data);
        console.log(data);
        // Check if the received message data is an array containing the single value 68
        if (data == 44) {
          Alert.alert("Notification", "The ASCII value 68 has been received.");
        }
      });
    
      // Cleanup function to unsubscribe from the channel
      return () => {
        instructionsChannel.unsubscribe();
        instructionsChannel.detach(err => {
          if (err) {
            console.error('Could not detach from the instructions channel:', err);
          }
        });
      };
    }, []);

    loadPets();
  }, []);

  const handleAddPet = async () => {
    // Add validation for the newPet data here
    const newPetWithId = {
      ...newPet,
      id: Date.now().toString(), // Use Date.now() as a simple unique ID
    };

    const updatedPets = [...pets, newPetWithId];
    setPets(updatedPets);

    // Save the updated list of pets
    try {
      const jsonValue = JSON.stringify(updatedPets);
      await AsyncStorage.setItem('@pets', jsonValue);
      Alert.alert('Success', 'Pet added successfully!');
      setNewPet({
        name: '',
        animal: '',
        breed: '',
        age: '',
        foodAmount: '',
        feedingTimes: '',
        feedingSchedule: [],
      }); // Reset the form
    } catch (e) {
      Alert.alert('Error', 'Failed to add pet.');
    }
  };

  const handleViewDetails = (pet) => {
    navigation.navigate('EditPet', { pet: pet });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Pets</Text>
      {pets.map((pet, index) => (
        <TouchableOpacity key={pet.id} style={styles.petProfile} onPress={() => handleViewDetails(pet)}>
          <Text style={styles.petName}>{pet.name}</Text>
        </TouchableOpacity>
      ))}
      {/* Add Pet Form */}
      <Text style={styles.title}>Add a New Pet</Text>
      <TextInput
        style={styles.input}
        placeholder="Pet's Name"
        value={newPet.name}
        onChangeText={(text) => setNewPet({ ...newPet, name: text })}
      />
      {/* Other Input Fields... */}
      <Button title="Add Pet" onPress={handleAddPet} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  petProfile: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Add additional styles as needed
});

export default ProfileScreen;
