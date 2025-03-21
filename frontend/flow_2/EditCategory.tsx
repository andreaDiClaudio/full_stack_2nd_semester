import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { useDispatch } from 'react-redux';

import { AppDispatch } from './slices/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { deleteCategory, setCategories, updateCategory } from './slices/categorySlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/flow_1/utils/types';
import { fetchEntries } from './slices/entrySlice';
import { Button, ButtonText } from '@/components/ui/button';

export default function EditCategoryScreen() {
  const { width: screenWidth } = Dimensions.get("window");
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const { category } = route.params as { category: { id: number; title: string; description?: string } };
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'EditCategory'>>();

  const [categoryName, setCategoryName] = useState(category.title);
  const [categoryDescription, setCategoryDescription] = useState(category.description || '');

  useEffect(() => {
    if (category) {
      setCategoryName(category.title);
      setCategoryDescription(category.description || '');
    }
  }, [category]);

  const onUpdateCategory = async () => {
    if (!categoryName.trim()) return; // Validate category name

    try {
      // Dispatch the update action and wait for the response
      const response = await dispatch(updateCategory({ id: category.id.toString(), title: categoryName }));

      // Check if the response is successful (you may have a success flag in your response payload)
      if (response?.meta?.requestStatus === 'fulfilled') {
        console.log('Category updated successfully')

        // Re-fetch the updated categories (triggering a new dispatch for fresh data)
        dispatch(fetchEntries());
        // Redirect on success
        navigation.goBack(); // Or use any other navigation logic as needed
      } else {
        console.error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      // Optionally, display an alert or show an error message to the user
      alert('An error occurred while updating the category');
    }
  };

  const onDeleteCategory = async () => {
    if (!categoryName.trim()) return;
    Alert.alert(
      "Confirmation",
      `Do you want to delete category: ${category.title}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            const response = await dispatch(deleteCategory(category.id));

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
    console.log(category);
  }
  
  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Edit Category</Text>

      <Input variant="outline" size="xl">
        <InputField
          value={categoryName}
          onChangeText={setCategoryName}
          placeholder="e.g. Food"
        />
      </Input>

      <Button size="xl" action="primary" onPress={onUpdateCategory} accessibilityLabel="Update category button">
        <ButtonText>Update</ButtonText>
      </Button>

      <Button
        size="xl"
        variant="solid"
        onPress={onDeleteCategory}
        accessibilityLabel="Delete category button"
      >
        <ButtonText style={{ color: 'red' }}>Delete</ButtonText>
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
