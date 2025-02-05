import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import React from 'react'
import { TodoEntity } from './TodoEntity';

export default function Todo() {
    const [todos, setTodos] = React.useState([] as TodoEntity[]);
    const [todo, setTodo] = React.useState('');
    const onAddTodo = () => {
        const newTodo = new TodoEntity(todos.length, todo);
        setTodos([...todos, newTodo]);
        console.log(todos);
    }
    return (
    <View style={styles.container}>
      <Text>Todo List</Text>
      <TextInput
          style={styles.input}
          onChangeText={setTodo}
          value={todo}
          placeholder="useless placeholder"
        />

        <Button
            onPress={onAddTodo}
            title="Add todo"
            color="#841584"
            accessibilityLabel="Add todo"
        />
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
      justifyContent:"center",
      alignItems:"center"
    },

  });