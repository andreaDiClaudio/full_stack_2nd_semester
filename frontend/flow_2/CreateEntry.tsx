import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect, useState } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem } from '@/components/ui/select';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types';
import { CategoryEntity } from '@/flow_1/CategoryEntity';
import { EntryEntity } from './entity/EntryEntity';

export default function CreateEntryScreen() {
    const { width: screenWidth } = Dimensions.get("window");
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();


    const [entries, setEntries] = useState<EntryEntity[]>([]);
    const [entryTitle, setEntryTitle] = useState('');
    const [entryAmount, setEntryAmount] = useState('');
    const [categories, setCategories] = useState<CategoryEntity[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    //TODO
    // - make the amount inut typ number
    useFocusEffect(
        React.useCallback(() => {
            fetchCategories();
        }, [])
    );

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/category');
            const data = await response.json();

            setCategories(data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const onAddEntry = async () => {
        const amount = parseInt(entryAmount, 10);
        if (!entryTitle.trim() || isNaN(amount) || amount < 1 || amount > 99 || !selectedCategory) {
            console.error("Invalid input");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: entryTitle, amount, categoryId: selectedCategory }),
            });
            if (response.ok) {
                setEntryTitle('');
                setEntryAmount('');
                setSelectedCategory(null);
            } else {
                console.error('Error creating entry', response);
            }
        } catch (error) {
            console.error('Error creating entry:', error);
        }
    };

    return (
        <View style={[styles.container, { width: screenWidth * 0.5 }]}>
            <Text style={styles.title}>Create Entry</Text>

            {/* Title Input */}
            <Input variant="outline" size="xl">
                <InputField
                    value={entryTitle}
                    onChangeText={setEntryTitle}
                    placeholder="e.g. Milk"
                />
            </Input>

            {/* Amount Input (Number 1-99) */}
            <Input variant="outline" size="xl">
                <InputField
                    value={entryAmount}
                    onChangeText={(text) => {
                        // Allow empty string (deleting all numbers)
                        if (text === "") {
                            setEntryAmount(text);
                        } else {
                            const num = parseInt(text, 10);
                            // Only update if the value is a valid number and within range
                            if (!isNaN(num) && num >= 1 && num <= 99) {
                                setEntryAmount(text);
                            }
                        }
                    }}
                    placeholder="Amount (1-99)"
                    keyboardType="numeric" // ✅ Move keyboardType here
                />
            </Input>

            {/* Category Dropdown */}
            <Select onValueChange={setSelectedCategory}>
                <SelectTrigger>
                    <SelectInput placeholder="Select a category" />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                        {categories?.length ? categories.map((category) => (
                            <SelectItem key={category.id} label={category.title} value={category.id.toString()} />
                        )) : <Text>No categories available</Text>}

                    </SelectContent>
                </SelectPortal>
            </Select>

            <Button size="xl" variant="solid" action="primary" onPress={onAddEntry}>
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
    title: {
        fontSize: 40,
        fontWeight: "600",
        textAlign: 'center',
    }
});
