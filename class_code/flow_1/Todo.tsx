import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Button, ButtonText } from "@/components/ui/button"
import React from 'react'
import { TodoEntity } from './TodoEntity';
import { Input, InputField } from '@/components/ui/input';


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

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>

      <Text style={{ fontSize: 40, fontWeight: 600 }}>Todo List</Text>
      <Input
        variant="outline"
        size="xl"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField
          value={todo}
          onChangeText={setTodo}
          placeholder="e.g. Call mom" />
      </Input>

      <Button
        size="xl"
        variant="solid"
        action="primary"
        onPress={onAddTodo}
        accessibilityLabel="Add todo button">
        <ButtonText>Create</ButtonText>
      </Button>

    </View>
  )
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

});