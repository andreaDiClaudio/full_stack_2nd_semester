// CreateEntryScreen.tsx
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem } from '@/components/ui/select';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types';
import { CategoryEntity } from '@/flow_1/CategoryEntity';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './slices/store';
import { fetchCategories, setCategories } from './slices/categorySlice';
import { createEntry, fetchEntries, resetEntryForm, setEntryAmount, setEntryTitle, setSelectedCategory } from './slices/entrySlice';

export default function CreateEntryScreen() {
  const { width: screenWidth } = Dimensions.get("window");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const dispatch = useDispatch<AppDispatch>();

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


  const onAddEntry = async () => {
    const amount = parseInt(entryAmount, 10);
    if (!entryTitle.trim() || isNaN(amount) || amount < 1 || amount > 99 || !selectedCategory) {
      console.error("Invalid input");
      return;
    }

    const entryData = {
      title: entryTitle,
      amount,
      categoryId: selectedCategory,
    };

    // Dispatch the createEntry async action
    const response = await dispatch(createEntry(entryData));
    // Check if the response is successful (you may have a success flag in your response payload)
    if (response?.meta?.requestStatus === 'fulfilled') {
      console.log('Category updated successfully')

      // Reset entry-related state to default values
      dispatch(resetEntryForm());

      // Re-fetch the updated categories (triggering a new dispatch for fresh data)
      dispatch(fetchEntries());
      navigation.goBack(); // Or use any other navigation logic as needed
    }
  };

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text style={styles.title}>Create Entry</Text>

      {/* Title Input */}
      <Input variant="outline" size="xl">
        <InputField
          value={entryTitle}
          onChangeText={(text) => dispatch(setEntryTitle(text))}
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
              dispatch(setEntryAmount(text));
            } else {
              const num = parseInt(text, 10);
              // Only update if the value is a valid number and within range
              if (!isNaN(num) && num >= 1 && num <= 99) {
                dispatch(setEntryAmount(text));
              }
            }
          }}
          placeholder="Amount (1-99)"
          keyboardType="numeric"
        />
      </Input>

      {/* Category Dropdown */}
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

      {/* Create Button */}
      <Button size="xl" variant="solid" action="primary" onPress={onAddEntry}>
        <ButtonText>Create</ButtonText>
      </Button>

      {/* Loading/Error Feedback */}
      {entryStatus === 'loading' && <Text>Loading...</Text>}
      {entryStatus === 'failed' && <Text style={{ color: 'red' }}>{entryError}</Text>}
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
