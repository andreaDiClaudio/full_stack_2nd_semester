import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { useNavigation } from '@react-navigation/native';

export default function EditScreen() {
  const { width: screenWidth } = Dimensions.get("window");

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text style={{ fontSize: 40, fontWeight: "600", textAlign:'center' }}>Edit Category</Text>
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
