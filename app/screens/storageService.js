// storageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const savePetDetails = async (pet) => {
  try {
    const jsonValue = JSON.stringify(pet);
    await AsyncStorage.setItem(`@PetApp:pet_${pet.id}`, jsonValue);
  } catch (e) {
    // Handle saving error, maybe throw a custom error or log it
    console.error('Error saving pet details', e);
  }
};

export const loadPetDetails = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    return result.map(req => JSON.parse(req[1])).filter(item => item !== null);
  } catch (e) {
    // Handle loading error, maybe throw a custom error or log it
    console.error('Error loading pet details', e);
    return []; // Return an empty array as a fallback
  }
};
