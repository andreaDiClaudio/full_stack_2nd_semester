import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
// import { Camera } from 'expo-camera';
import { Camera } from 'expo-camera/legacy';
import * as MediaLibrary from 'expo-media-library';


export default function CameraComponent({ setPhotoToDisplay, setCamera }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [photo, setPhoto] = useState(null);


    // Request permissions for camera and media library
    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === 'granted');
            setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
        })();
    }, []);


    // Check if the permissions are granted
    if (hasCameraPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }

    if (hasCameraPermission === false) {
        return <Text>Camera permission not granted. Please enable it in your device settings.</Text>;
    }

    // Function to take a picture
    const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setPhoto(photo);
            setPhotoToDisplay(photo);
        }
    };

    // Function to save the picture to the media library
    const savePicture = async () => {
        if (photo && hasMediaLibraryPermission) {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            setPhoto(null);
            setPhotoToDisplay(null);
            setCamera(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {photo ? (
                // Display save and discard buttons after taking a picture
                <View style={styles.buttonContainer}>
                    <Button title="Save Photo" onPress={savePicture} />
                    <Button title="Discard" onPress={() => { setPhoto(null); setCamera(false) }} />
                </View>
            ) : (
                // Camera view with a button to take a picture
                <Camera style={styles.camera} ref={ref => setCameraRef(ref)}>
                    <View style={styles.buttonContainer}>
                        <Button title="Take Picture" onPress={takePicture} />
                    </View>
                </Camera>
            )}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        alignSelf: 'center',
        marginBottom: 20,
    },
})