import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/flow_1/utils/types';
import { StackNavigationProp } from '@react-navigation/stack';

export default function EditScreen() {
  const { width: screenWidth } = Dimensions.get("window");

  type EditScreenRouteProp = RouteProp<RootStackParamList, 'Edit'>;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Edit'>>();

  const route = useRoute<EditScreenRouteProp>();
  const { categoryId, categoryTitle } = route.params;

  // Initialize state with categoryTitle from route params
  const [categoryName, setCategoryName] = React.useState(categoryTitle);

  const editCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/category/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: categoryName }),
      });
      if (response.ok) {
        console.log('Category updated successfully');
        navigation.goBack();
      } else {
        console.error('Error updating category', response);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const onDeletePress = () => {
    navigation.navigate('Delete', { categoryId: categoryId, categoryTitle: categoryTitle });
  };

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Edit Category</Text>

      <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false}>
        <InputField
          value={categoryName}
          onChangeText={setCategoryName}
          placeholder="e.g. Work"
        />
      </Input>

      <Button size="xl" variant="solid" action="primary" onPress={editCategory} accessibilityLabel="Edit category name button">
        <ButtonText>Edit</ButtonText>
      </Button>
      <Button size="xl" variant="solid" action="primary" onPress={onDeletePress} accessibilityLabel="Delete category">
        <ButtonText>Delete</ButtonText>
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
    margin: 'auto'
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
