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

  // Function to handle item press (you can adjust this for any further functionality)
  const handlePressCategory = (category: CategoryEntity) => {
    console.log('Category pressed:', category);
    navigation.navigate('Edit', { categoryId: category.id, categoryTitle: category.title });
  };

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Category List</Text>

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
    paddingTop:100
  },

  listContainer: {
    height: 500,
    width: "100%",
    marginTop: 10,
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
