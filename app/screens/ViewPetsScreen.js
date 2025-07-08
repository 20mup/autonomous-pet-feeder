import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import * as Ably from 'ably';

const ably = new Ably.Realtime.Promise('f16LJw.X_qNDQ:so3HWdPvjwXvw9qk1qTlfqJsZJ1H9B6rQGCUhzleYpE')
const channel = ably.channels.get('Instructions'); 

const ViewPetsScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
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
        Alert.alert("Notification", "Food has been dispensed.");
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

  useFocusEffect(
    React.useCallback(() => {
      const loadPets = async () => {
        try {
          const petsArray = await AsyncStorage.getItem('@pets');
          const loadedPets = petsArray ? JSON.parse(petsArray) : [];
          setPets(loadedPets);
        } catch (e) {
          Alert.alert('Error', 'Failed to load pets.');
        }
      };

      loadPets();
    }, [])
  );

  const handlePetPress = (pet) => {
    navigation.navigate('EditPet', { pet: pet });
  };

  const renderPetButton = (pet, index) => {
    const buttonText = pet ? pet.name : 'Add a new member to the family';
    return (
      <TouchableOpacity
        key={index}
        style={styles.petButton}
        onPress={() => handlePetPress(pet)}
      >
        <Text style={styles.petButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground 
      source={require('../assets/mountainscreen.png')} // Make sure the path is correct
      style={styles.backgroundContainer}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Your Pets</Text>
        {Array.from({ length: 4 }, (_, index) => renderPetButton(pets[index], index))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 46,
    fontWeight: 'bold',
    fontFamily: 'KOMIKAX',
    color: '#004C4C',
    marginBottom: 20,
  },
  petButton: {
    backgroundColor: '#004C4C',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  petButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'KOMIKAX',
    color: '#ffff',
  },
});

export default ViewPetsScreen;
