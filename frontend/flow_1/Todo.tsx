import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React from 'react';
import { TodoEntity } from './TodoEntity';
import { Input, InputField } from '@/components/ui/input';
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox"

export default function Todo() {
  const { width: screenWidth } = Dimensions.get("window");

  const [todos, setTodos] = React.useState([] as TodoEntity[]);
  const [todo, setTodo] = React.useState('');

  const onAddTodo = () => {
    setTodos((prevTodos) => {
      const currentTodo = new TodoEntity(prevTodos.length, todo);
      const updatedTodos = [...prevTodos, currentTodo];
      console.log("LIST:", updatedTodos);
      return updatedTodos;
    });

    setTodo("");
  };

  // Function to handle item press and log the todo object
  const handlePressTodo = (todo: TodoEntity) => {
    const updatedTodos = todos.map((item) =>
      item.id === todo.id
        ? { ...item, isCompleted: !item.isCompleted }
        : item
    );

    console.log("Updated todos:", updatedTodos); // Log the updated state

    setTodos(updatedTodos);
  };

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text style={{ fontSize: 40, fontWeight: "600" }}>Todo List</Text>

      <Input variant="outline" size="xl" isDisabled={false} isInvalid={false} isReadOnly={false}>
        <InputField value={todo} onChangeText={setTodo} placeholder="e.g. Call mom" />
      </Input>

      <Button size="xl" variant="solid" action="primary" onPress={onAddTodo} accessibilityLabel="Add todo button">
        <ButtonText>Create</ButtonText>
      </Button>

      <View style={[styles.container, { paddingTop: 30 }, { width: "140%" }]}>
        <View style={styles.listContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePressTodo(item)} style={styles.todoItem}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    size="md"
                    isInvalid={false}
                    isDisabled={false}
                    value={item.id.toString()}
                    isChecked={item.isCompleted}
                    style={styles.checkbox}
                  >
                    <CheckboxIndicator />
                  </Checkbox>
                  <Text style={styles.checkboxText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

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
    flexDirection: "row", // Ensure layout of items is row-based
    alignItems: "center", // Align text and checkbox on the same line
  },
  checkbox: {
    flexDirection: "row", // To make the checkbox and text appear in a row
    alignItems: "center", // Align text and checkbox vertically
  },

  checkboxContainer: {
    flexDirection: "row", // Align checkbox and text horizontally
    alignItems: "center", // Vertically center the checkbox and text
  },

  checkboxText: {
    fontSize: 25,
    marginLeft: 10, // Space between the checkbox and the text
  },
});
