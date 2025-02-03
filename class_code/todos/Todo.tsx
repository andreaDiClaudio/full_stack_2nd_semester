import { View, Text, TextInput, StyleSheet, Button, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView } from 'react-native';
import React from 'react';
import { TodoEntity } from './TodoEntity';

export default function Todo() {
    const [todos, setTodos] = React.useState([] as TodoEntity[]);
    const [todo, setTodo] = React.useState('');

    const onAddTodo = () => {
        
        console.log(todo);
        
        
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Todo</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setTodo}
                        value={todo}
                        placeholder="e.g. call mom"
                    />

                    <Button
                        onPress={onAddTodo}
                        title="Add todo"
                        color="#841584"
                        accessibilityLabel="Add todo"
                    />
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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

    title: {
        fontWeight: '600',
        fontSize: 50,
    },

    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
