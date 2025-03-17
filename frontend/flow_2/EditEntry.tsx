import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AppDispatch, RootState } from './slices/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types';
import { deleteEntry, fetchEntries } from './slices/entrySlice';
import { resetEntryForm, setEntryAmount, setEntryTitle, setSelectedCategory, updateEntry } from './slices/entrySlice';
import { CategoryEntity } from '@/flow_1/CategoryEntity';
import { Select, SelectBackdrop, SelectContent, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { fetchCategories } from './slices/categorySlice';

//TODO: delete
const EditEntryScreen = () => {
    const { width: screenWidth } = Dimensions.get("window");
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'EditEntry'>>();

    // Get entry data passed through navigation
    const route = useRoute();
    const { entry } = route.params as { entry: { id: number; title: string; amount: number; category: { id: number; title: string } } };

    // Redux state
    const entryTitle = useSelector((state: RootState) => state.entry.entryTitle);
    const entryAmount = useSelector((state: RootState) => state.entry.entryAmount);
    const selectedCategory = useSelector((state: RootState) => state.entry.selectedCategory);
    const categories = useSelector((state: RootState) => state.category.categories);
    const entryStatus = useSelector((state: RootState) => state.entry.status);
    const entryError = useSelector((state: RootState) => state.entry.error);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchCategories());
        }, [dispatch])
    );


    const entryData = {
        id: entry.id,
        title: entryTitle,
        amount: entryAmount,
        categoryId: parseInt(selectedCategory!, 10),
    };

    // Populate the form with the current entry data
    useEffect(() => {
        dispatch(setEntryTitle(entry.title));
        dispatch(setEntryAmount(entry.amount.toString()));
        dispatch(setSelectedCategory(entry.category.id.toString()));
    }, [dispatch, entry]);

    const onUpdateEntry = async () => {
        const amount = parseInt(entryAmount, 10);
        if (!entryTitle.trim() || isNaN(amount) || amount < 1 || amount > 99 || !selectedCategory) {
            console.error("Invalid input");
            return;
        }

        const entryData = {
            id: entry.id,
            title: entryTitle,
            amount: amount,
            categoryId: parseInt(selectedCategory, 10),
        };

        try {
            // Dispatch the update action and wait for the response
            const response = await dispatch(updateEntry(entryData));

            if (response?.meta?.requestStatus === 'fulfilled') {
                console.log('Entry updated successfully');
                dispatch(resetEntryForm());
                dispatch(fetchEntries());
                navigation.goBack(); // Redirect on success
            } else {
                console.error('Failed to update entry');
                alert('Failed to update entry');
            }
        } catch (error) {
            console.error('Error updating entry:', error);
            alert('An error occurred while updating the entry');
        }
    };

    const onDeleteEntry = async () => {
        if (!entryTitle.trim()) return;
        Alert.alert(
            "Confirmation",
            `Do you want to delete category: ${entry.title}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        const response = await dispatch(deleteEntry(entry.id));

                        // Check if the response is successful (you may have a success flag in your response payload)
                        if (response?.meta?.requestStatus === 'fulfilled') {
                            console.log('Category deleted successfully')

                            // Re-fetch the updated categories (triggering a new dispatch for fresh data)
                            dispatch(fetchEntries());
                            // Redirect on success
                            navigation.goBack(); // Or use any other navigation logic as needed
                        } else {
                            console.error('Failed to delete category');
                        }
                    }
                }
            ],
            { cancelable: false }
        );

    }

    return (
        <View style={[styles.container, { width: screenWidth * 0.5 }]}>
            <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Edit Entry</Text>

            <Input variant="outline" size="xl">
                <InputField
                    value={entryTitle}
                    onChangeText={(text) => dispatch(setEntryTitle(text))}
                    placeholder="e.g. Milk"
                />
            </Input>

            <Input variant="outline" size="xl">
                <InputField
                    value={entryAmount}
                    onChangeText={(text) => {
                        if (text === "") {
                            dispatch(setEntryAmount(text));
                        } else {
                            const num = parseInt(text, 10);
                            if (!isNaN(num) && num >= 1 && num <= 99) {
                                dispatch(setEntryAmount(text));
                            }
                        }
                    }}
                    placeholder="Amount (1-99)"
                    keyboardType="numeric"
                />
            </Input>

            <Select onValueChange={(value) => dispatch(setSelectedCategory(value))}>
                <SelectTrigger>
                    <SelectInput placeholder="Select a category" />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                        {categories?.length ? categories.map((category: CategoryEntity) => (
                            <SelectItem key={category.id} label={category.title} value={category.id.toString()} />
                        )) : <Text>No categories available</Text>}
                    </SelectContent>
                </SelectPortal>
            </Select>

            <Button size="xl" variant="solid" action="primary" onPress={onUpdateEntry}>
                <ButtonText>Update</ButtonText>
            </Button>

            <Button
                size="xl"
                variant="solid"
                onPress={onDeleteEntry}
                accessibilityLabel="Delete entry button"
            >
                <ButtonText style={{ color: 'red' }}>Delete</ButtonText>
            </Button>

            {/* Loading/Error Feedback */}
            {entryStatus === 'loading' && <Text>Loading...</Text>}
            {entryStatus === 'failed' && <Text style={{ color: 'red' }}>{entryError}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 20,
        paddingTop: 200,
    },
});

export default EditEntryScreen;
