import * as ImagePicker from 'expo-image-picker';
import { Button, View, Image, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';

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

  const handleSave = () => {
    console.log('sending to backend');
    // You can implement actual upload logic here later
    Alert.alert('Photo saved', 'Pretend this was sent to backend.');
    setImage(null); // Optional: reset after saving
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
