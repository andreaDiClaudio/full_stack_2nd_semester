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
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useCreateEntry } from '@/flow_3/hooks/useCreateEntry';

export default function CreateEntryScreen() {
  const { width: screenWidth } = Dimensions.get("window");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const dispatch = useDispatch<AppDispatch>();

  const entryTitle = useSelector((state: RootState) => state.entry.entryTitle);
  const entryAmount = useSelector((state: RootState) => state.entry.entryAmount);
  const selectedCategory = useSelector((state: RootState) => state.entry.selectedCategory);
  const categories = useSelector((state: RootState) => state.category.categories);

  const {
    mutate: createEntryMutation,
    isPending,
    error,
  } = useCreateEntry();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchCategories());
    }, [dispatch])
  );

  const onAddEntry = () => {
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

    createEntryMutation(entryData, {
      onSuccess: () => {
        dispatch(resetEntryForm());
        navigation.goBack();
      },
    });
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
