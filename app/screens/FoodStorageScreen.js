import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import * as Ably from 'ably';

const FoodStorageScreen = () => {
  const [foodStorageAmount, setFoodStorageAmount] = useState('Check');
  const ably = new Ably.Realtime.Promise('f16LJw.X_qNDQ:so3HWdPvjwXvw9qk1qTlfqJsZJ1H9B6rQGCUhzleYpE'); // Replace with your actual key
  const channel = ably.channels.get('Instructions');
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
    // Attach to the channel
    channel.attach(err => {
      if (err) {
        console.error('Could not attach to the Instructions channel:', err);
      } else {
        console.log('Successfully attached to the Instructions channel');
      }
    });

    // Subscribe to messages on the channel
    channel.subscribe((message) => {
      //data = JSON.parse(message.data);
      console.log('Received message on FoodStorage channel:', message.data);
      // Assuming the message data is the amount of food
      
      const amount = parseInt(message.data, 10);
      console.log(amount);
      //The && is used so that the check statement doesn't show the test messages as the storage percentage
      if (!isNaN(amount) && amount != 54657374) {
        // Convert the amount to a string and remove all "3"s
        const amountWithout3 = amount.toString().replace(/3/g, '');
        const amountWithout = amountWithout3.toString().concat('% full');
    
        setFoodStorageAmount(amountWithout); // Set the modified amount as the button text
      } else {
        //Alert.alert("Error", "Invalid data received.");
      }
    });

    // Cleanup function to unsubscribe from the channel
    return () => {
      channel.unsubscribe('Instructions');
      channel.detach(err => {
        if (err) {
          console.error('Could not detach from the Instructions channel:', err);
        } else {
          console.log('Detached from the Instructions channel');
        }
      });
    };
  }, []);

  const handleCheckPress = () => {
    console.log('Sending "Check" to the Instructions channel');
    channel.publish('check', 'Check')
      .then(() => {
        console.log('Successfully sent "Check" to the Instructions channel');
      })
      .catch(err => {
        console.error('Failed to send "Check" to the Instructions channel:', err);
      });
    setFoodStorageAmount('Checking...'); // Temporary text until the response is received
  };

  return (
    <ImageBackground 
      source={require('../assets/CheckScreen.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Overlay to provide better text visibility if needed */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.checkCircle} onPress={handleCheckPress}>
          <Text style={styles.checkText}>{foodStorageAmount}</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>Check how much food is left</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center children horizontally
    justifyContent: 'center', // Center children vertically
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    // Adjust these values to position your circle correctly
    width: 250,
    height: 250,
    borderRadius: 125, // Half the width/height to make it a circle
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Set to 'transparent' to let your image show through
    // Positioning the circle in the center
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -125 }], // Adjust translateY to fit the circle in your background image
  },
  checkText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'KOMIKAX',
    textAlign: 'center',
    color: '#fff', // Color for the text inside the circle
  },
  instructions: {
    fontSize: 38,
    fontWeight: 'bold',
    fontFamily: 'KOMIKAX',
    textAlign: 'center',
    position: 'absolute',
    top: '10%', // Adjust as necessary
    color: '#004C4C', // Color for the instructions text
  },
  // ... other styles if needed ...
});

export default FoodStorageScreen;