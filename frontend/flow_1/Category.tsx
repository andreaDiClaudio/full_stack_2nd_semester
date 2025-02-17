import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { CategoryEntity } from './CategoryEntity';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './utils/types';

export default function Category() {
  const { width: screenWidth } = Dimensions.get("window");

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const [categories, setCategories] = React.useState([] as CategoryEntity[]);
  const [categoryName, setCategoryName] = React.useState('');

  // Fetch categories on component load
  useEffect(() => {
    fetchCategories();
  }, []);

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
        fetchCategories(); // Refresh the category list after creation
      } else {
        console.error('Error creating category', response);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Function to handle item press (you can adjust this for any further functionality)
  const handlePressCategory = (category: CategoryEntity) => {
    console.log('Category pressed:', category);
    navigation.navigate('Edit', { categoryId: category.id, categoryTitle: category.title });
  };

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Category List</Text>

      <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false}>
        <InputField value={categoryName} onChangeText={setCategoryName} placeholder="e.g. Work" />
      </Input>

      <Button size="xl" variant="solid" action="primary" onPress={onAddCategory} accessibilityLabel="Create category button">
        <ButtonText>Create</ButtonText>
      </Button>

      <View style={[styles.container, { paddingTop: 30 }, { width: "140%" }]}>
        <View style={styles.listContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePressCategory(item)} style={styles.todoItem}>
                <Text style={styles.checkboxText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 20,
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
