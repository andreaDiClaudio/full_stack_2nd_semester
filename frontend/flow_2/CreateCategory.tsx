import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useState } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { createCategory } from './slices/categorySlice';
import { AppDispatch } from './slices/store';

export default function CreateCategoryScreen() {
    const { width: screenWidth } = Dimensions.get("window");
    const dispatch = useDispatch<AppDispatch>();

    const [categoryName, setCategoryName] = useState('');

    const onAddCategory = async () => {
        if (!categoryName.trim()) return;

        try {
            // Dispatch the createCategory async action
            await dispatch(createCategory(categoryName));
            setCategoryName(''); // Clear the input field on success
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
        paddingTop: 200,
    },
});
