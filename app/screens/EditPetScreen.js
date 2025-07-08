import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Ably from 'ably';

const ably = new Ably.Realtime.Promise('f16LJw.X_qNDQ:so3HWdPvjwXvw9qk1qTlfqJsZJ1H9B6rQGCUhzleYpE'); // Replace with your actual key
const channel = ably.channels.get('Instructions');  

const EditPetScreen = ({ route, navigation }) => {
  const [pet, setPet] = useState({
    id: '',
    name: '',
    animal: '',
    breed: '',
    age: '',
    foodAmount: '',
    feedingTimes: '',
    feedingSchedule: [],
  });

  // useEffect(() => {
  //   const instructionsChannel = ably.channels.get('Instructions');
  
  //   // Attach to the channel
  //   instructionsChannel.attach(err => {
  //     if (err) {
  //       console.error('Could not attach to the instructions channel:', err);
  //     }
  //   });
  
  //   // Subscribe to messages
  //   instructionsChannel.subscribe(message => {
  //     data = JSON.parse(message.data);
  //     console.log(data);
  //     // Check if the received message data is an array containing the single value 68
  //     if (data == 44) {
  //       Alert.alert("Notification", "The ASCII value 68 has been received.");
  //     }
  //   });
  
  //   // Cleanup function to unsubscribe from the channel
  //   return () => {
  //     instructionsChannel.unsubscribe();
  //     instructionsChannel.detach(err => {
  //       if (err) {
  //         console.error('Could not detach from the instructions channel:', err);
  //       }
  //     });
  //   };
  // }, []);

  useEffect(() => {
    if (route.params?.pet) {
      setPet(route.params.pet);
    }
  }, [route.params]);

  const scheduleFeeding = (feedingTimes) => {
    // Assuming feedingTimes is an array of strings: ["HH:MM", "HH:MM", ...]
    feedingTimes.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const feedingTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (now < feedingTimeToday) {
        // Set a timeout to send the food request at the feeding time
        const timeoutDuration = feedingTimeToday - now;
        setTimeout(() => feedNow(pet.foodAmount), timeoutDuration);
      }
    });
  };

  const feedNow = (foodAmount) => {
    const foodRequestMessage = "FoodRequest " + foodAmount;
    channel.publish('feed', foodRequestMessage);
  };

  const handleSavePet = async () => {
    // Validate and save the pet details, then schedule feeding
    try {
      const existingPetsJson = await AsyncStorage.getItem('@pets');
      let existingPets = existingPetsJson ? JSON.parse(existingPetsJson) : [];
      if (pet.id) {
        // It's an existing pet, update it
        const petIndex = existingPets.findIndex((p) => p.id === pet.id);
        if (petIndex !== -1) existingPets[petIndex] = pet;
      } else {
        // It's a new pet, add it
        pet.id = Date.now().toString();
        existingPets.push(pet);
      }
      await AsyncStorage.setItem('@pets', JSON.stringify(existingPets));
      Alert.alert('Success', 'Pet details saved!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save pet details.');
    }

    // Schedule the feeding times
    const feedingTimesArray = pet.feedingTimes.split(',').map(time => time.trim());
    scheduleFeeding(feedingTimesArray);
  };

  const handleDeletePet = async () => {
    try {
      const existingPets = await AsyncStorage.getItem('@pets');
      let pets = existingPets ? JSON.parse(existingPets) : [];
      const updatedPets = pets.filter((p) => p.id !== pet.id);
      await AsyncStorage.setItem('@pets', JSON.stringify(updatedPets));
      Alert.alert('Success', 'Pet deleted successfully!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to delete pet.');
    }
  };


  return (
    <ImageBackground 
      source={require('../assets/mountainscreen.png')} // Make sure the path is correct
      style={styles.backgroundContainer}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>Edit Pet Profile</Text>
        {/* The TextInput components */}
        <TextInput
          style={styles.input}
          placeholder="Pet's Name"
          value={pet.name}
          onChangeText={(text) => setPet({ ...pet, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Type of Animal"
          value={pet.animal}
          onChangeText={(text) => setPet({ ...pet, animal: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Breed"
          value={pet.breed}
          onChangeText={(text) => setPet({ ...pet, breed: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={pet.age}
          onChangeText={(text) => setPet({ ...pet, age: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Food Amount (grams)"
          value={pet.foodAmount}
          onChangeText={(text) => setPet({ ...pet, foodAmount: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Feeding Times (HH:MM, separated by commas)"
          value={pet.feedingTimes}
          onChangeText={(text) => setPet({ ...pet, feedingTimes: text })}
        />
        {/* Buttons for saving and deleting a pet */}
        <Button title="Save Pet" onPress={handleSavePet} />
        <Button title="Delete Pet" onPress={handleDeletePet} color="red" />
      </ScrollView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  overlay: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    fontFamily: 'KOMIKAX',
    marginBottom: 20,
    color: '#004C4C', // You might want to change this depending on your image
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.9)', // Semi-transparent white for visibility
    width: '100%', // You may adjust this as necessary
  },
  // ... Add other styles you might need
});

export default EditPetScreen;
