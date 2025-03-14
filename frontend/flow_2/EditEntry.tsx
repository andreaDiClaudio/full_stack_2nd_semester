// flow_2/EditEntry.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { AppDispatch } from './slices/store';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { EntryEntity } from '@/flow_1/Home';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types';

const EditEntryScreen = () => {

    const { width: screenWidth } = Dimensions.get("window");
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute();
    const { entry } = route.params as {entry:{ id: number, title: string, amount: number, category: { id: number; title: string; description?: string } }};
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'EditEntry'>>();

    console.log();
    
    return (
        <View style={styles.screenContainer}>
            <Text>Edit Page</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default EditEntryScreen;
