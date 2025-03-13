import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types';
import { CategoryEntity } from '@/flow_1/CategoryEntity';
import { EntryEntity } from './entity/EntryEntity';

export default function CreateEntryScreen() {
    const { width: screenWidth } = Dimensions.get("window");

    //TODO: finish to add all the input and categories fetchin for dropdown

    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

    const [entries, setEntries] = React.useState([] as EntryEntity[]);
    const [entryTitle, setEntryTitle] = React.useState('');
    const [entryAmount, setEntryAmount] = React.useState('');

    const onAddCategory = async () => {
        if (!entryTitle.trim()) return;

        try {
            const response = await fetch('http://localhost:3000/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: entryTitle }),
            });
            if (response.ok) {
                setEntryTitle('');
            } else {
                console.error('Error entry category', response);
            }
        } catch (error) {
            console.error('Error entry category:', error);
        }
    };


    return (
        <View style={[styles.container, { width: screenWidth * 0.5 }]}>
            <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Create Entry</Text>

            <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false}>
                <InputField
                    value={entryTitle}
                    onChangeText={setEntryTitle}
                    placeholder="e.g. Milk"
                />
            </Input>

            <Button size="xl" variant="solid" action="primary" onPress={onAddCategory} accessibilityLabel="Create Entry button">
                <ButtonText>Create</ButtonText>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 20,
        paddingTop:200
    },

    listContainer: {
        height: 300,
        width: "100%",
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
    },

    todoItem: {
        padding: 10,
        marginBottom: 5,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
    },

    checkboxText: {
        fontSize: 25,
    },
});
