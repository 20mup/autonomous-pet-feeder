import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';


import * as Ably from 'ably';

const ably = new Ably.Realtime.Promise('f16LJw.X_qNDQ:so3HWdPvjwXvw9qk1qTlfqJsZJ1H9B6rQGCUhzleYpE')
const channel = ably.channels.get('Instructions'); 

const HomeScreen = ({ navigation }) => {
  // Replace 'UserName' with actual user name variable if available
  const userName = 'UserName';

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

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'KOMIKAX': require('../assets/fonts/KOMIKAX_.ttf'), // Update the path to where your font file is located
      });
    };
    
    loadFonts();
  }, []);
  

  return (
    <ImageBackground
      source={require('../assets/HomeScreenfinal.png')} // Ensure this path is correct
      style={styles.background}
    >
      <Text style={styles.welcomeMessage}>WELCOME!</Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.startButtonText}>Start</Text>
    </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-start', // Aligns welcome text to the top
    alignItems: 'center',
    paddingTop: '25%', // Adjust as needed for your welcome message
    paddingHorizontal: 20,
  },
  welcomeMessage: {
    fontSize: 58,
    fontWeight: 'bold',
    fontFamily: 'KOMIKAX',
    color: '#004C4C', // Ensure the color is visible against your background
    marginBottom: '60%', // Adjust the space between the text and the button
  },
  startButton: {
    backgroundColor: '#004C4C', // Use a contrasting color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: 'absolute', // Position button at the bottom of the screen
    bottom: 100, // Adjust distance from the bottom
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontFamily: 'KOMIKAX',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
