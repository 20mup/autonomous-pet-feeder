import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import * as Ably from 'ably';
import { useState, useEffect } from 'react';

const ably = new Ably.Realtime.Promise('f16LJw.X_qNDQ:so3HWdPvjwXvw9qk1qTlfqJsZJ1H9B6rQGCUhzleYpE')
const instructionsChannel = ably.channels.get('Instructions');

const MainMenuScreen = ({ navigation }) => {
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
  return (
    <ImageBackground 
      source={require('../assets/oceanscreen.png')}  // Make sure the path is correct
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>What would you like to do today?</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ViewPets')}>
        <Text style={styles.buttonText}>View Pets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FoodStorage')}>
        <Text style={styles.buttonText}>Check Food Storage</Text>
      </TouchableOpacity>

      {/* Add more buttons for other options as needed */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Remove the backgroundColor since we're using an image now
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'KOMIKAX',

    marginBottom: 10,
    color: '#004C4C', // Adjust color to be visible on the ocean background
  },
  button: {
    width: '100%',
    backgroundColor: '#004C4C', // Slight transparency
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'KOMIKAX',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainMenuScreen;
