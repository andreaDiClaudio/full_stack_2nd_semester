import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types';
import { CategoryEntity } from '@/flow_1/CategoryEntity';

export default function CreateCategoryScreen() {
    const { width: screenWidth } = Dimensions.get("window");

    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();


    const [categories, setCategories] = React.useState([] as CategoryEntity[]);
    const [categoryName, setCategoryName] = React.useState('');

    const onAddCategory = async () => {
        if (!categoryName.trim()) return;

        try {
            const response = await fetch('http://localhost:3000/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: categoryName }),
            });
            if (response.ok) {
                setCategoryName('');
            } else {
                console.error('Error creating category', response);
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };


    return (
        <View style={[styles.container, { width: screenWidth * 0.5 }]}>
            <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Create Category</Text>

            <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false}>
                <InputField
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder="e.g. Food"
                />
            </Input>

            <Button size="xl" variant="solid" action="primary" onPress={onAddCategory} accessibilityLabel="Create category button">
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
