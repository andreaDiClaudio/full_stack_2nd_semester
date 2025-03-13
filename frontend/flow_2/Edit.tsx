import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button, ButtonText } from "@/components/ui/button";
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/flow_1/utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryEntity } from '@/flow_1/CategoryEntity';
import { setCategories } from './slices/categorySlice';

// Define the type for route.params based on entityType
type RouteParams = {
  entityId: number;
  entityTitle: string;
  entityType: 'category' | 'entry';
  category?: {
    id: number;
    title: string;
    description: string;
  };
  amount?: number; // amount exists only for 'entry'
};

export default function EditScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Edit'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Edit'>>();
  const dispatch = useDispatch();
  const categories = useSelector((state: any) => state.category.categories);
  
  const [title, setTitle] = useState<string>(params.entityTitle || '');

  // Edit category handler
  const handleEdit = () => {
    if (!title) {
      alert("Please fill field");
      return;
    }

    const updatedCategory: CategoryEntity = {
      id: params.entityId,
      title,
    };

    // For simplicity, we'll directly update the Redux state
    const updatedCategories = categories.map((category: CategoryEntity) =>
      category.id === params.entityId ? updatedCategory : category
    );
    dispatch(setCategories(updatedCategories));

    // Navigate back after editing
    navigation.goBack();
  };

  // Delete category handler
  const handleDelete = () => {
    // Confirm delete action
    const confirmDelete = confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      // Here you would normally delete the category from the server
      // For simplicity, we'll directly update the Redux state
      const updatedCategories = categories.filter((category: CategoryEntity) => category.id !== params.entityId);
      dispatch(setCategories(updatedCategories));

      // Navigate back after deleting
      navigation.goBack();
    }
  };

  useEffect(() => {
    // Initialize the state with the category data if available
    if (params.category) {
      setTitle(params.category.title);
    }
  }, [params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Category</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Category Title"
      />

      <Button onPress={handleEdit}>
        <ButtonText>Edit Category</ButtonText>
      </Button>

      <Button onPress={handleDelete} style={styles.deleteButton}>
        <ButtonText>Delete Category</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },

  deleteButton: {
    backgroundColor: 'red',
  },
});
