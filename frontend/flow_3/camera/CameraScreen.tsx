import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const cameraRef = useRef<CameraView>(null); // Correctly type the cameraRef
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean>();
  const [photo, setPhoto] = useState<any>(null);

  // Automatically ask for permission when the component mounts
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>;
  }

  // Function to take a picture
  const takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    if (cameraRef.current) {
      const newPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(newPhoto);
    }
  };

  // Function to share the photo
  const sharePic = () => {
    if (photo?.uri) {
      shareAsync(photo.uri).then(() => {
        setPhoto(null);
      });
    }
  };

  // Function to save the photo to the media library
  const savePhoto = () => {
    if (photo?.uri && hasMediaLibraryPermission) {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(null);
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePic}>
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {photo && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo.uri }} style={styles.photo} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={savePhoto}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={sharePic}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 50,
  },
  captureText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  photoContainer: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },
  photo: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
