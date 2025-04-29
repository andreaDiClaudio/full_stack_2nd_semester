import * as ImagePicker from 'expo-image-picker';
import { Button, View, Image, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

//TODO implement backend
export default function CameraScreen() {
  const [image, setImage] = useState<string | null>(null);

  const openNativeCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCancel = () => {
    setImage(null);
  };

  const handleSave = async () => {
    if (!image) return;

    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send to backend
      const response = await axios.post('http://192.168.0.87:3000/image/upload', {
        image: base64,
      });

      console.log('Image uploaded:', response.data);
      Alert.alert('Success', 'Image sent to backend.');
      setImage(null);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Error', 'Failed to send image.');
    }
  };

  return (
    <View>
      <Button title="Open Camera" onPress={openNativeCamera} />
      {image && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.buttonRow}>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={handleCancel} color="#d9534f" />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleSave} color="#5cb85c" />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 250,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
});
