import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/flow_1/utils/types';
import { StackNavigationProp } from '@react-navigation/stack';

export default function DeleteCategoryScreen() {
    const { width: screenWidth } = Dimensions.get("window");

    type EditScreenRouteProp = RouteProp<RootStackParamList, 'Edit'>;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Delete'>>();

    //TODO FIX
    const route = useRoute<EditScreenRouteProp>();
    const { categoryId, categoryTitle } = route.params;

    // Initialize state with categoryTitle from route params
    const [categoryName, setCategoryName] = React.useState(categoryTitle);

    const deleteCategory = async () => {
        if (!categoryName.trim()) return;

        try {
            const response = await fetch(`http://localhost:3000/category/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: categoryName }),
            });
            if (response.ok) {
                console.log('Category updated successfully');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  });
            } else {
                console.error('Error updating category', response);
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleOnPress = async () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { width: screenWidth * 0.5 }]}>
            <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Delete Category '{categoryName}'</Text>

            <Button
                size="xl"
                variant="solid"
                action="primary"
                onPress={deleteCategory}
                accessibilityLabel="Delete category button"
            >
                <ButtonText>Delete</ButtonText>
            </Button>
            <Button
                size="xl"
                variant="solid"
                action="primary"
                onPress={handleOnPress}
                accessibilityLabel="Go Back button"
            >
                <ButtonText>Go Back</ButtonText>
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
