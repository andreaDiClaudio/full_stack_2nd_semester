import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './utils/types';
import { CategoryEntity } from './CategoryEntity';
import { useEntries } from '@/flow_3/hooks/useEntries';
import { EntryEntity } from '@/flow_2/entity/EntryEntity';

export default function Entries() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const { data: entries = [], isLoading, isError } = useEntries();
  const [groupedEntries, setGroupedEntries] = useState<Record<string, EntryEntity[]>>({});
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());
  const { width: screenWidth } = Dimensions.get("window");

  useEffect(() => {
    if (entries.length > 0) {
      const grouped: Record<string, EntryEntity[]> = {};
      entries.forEach((entry: EntryEntity) => {
        const categoryId = entry.category?.id.toString();
        if (categoryId) {
          if (!grouped[categoryId]) grouped[categoryId] = [];
          grouped[categoryId].push(entry);
        }
      });
      setGroupedEntries(grouped);
    }
  }, [entries]);

  const handleToggleSelect = (entryId: number) => {
    setSelectedEntries((prev) => {
      const newSet = new Set(prev);
      newSet.has(entryId) ? newSet.delete(entryId) : newSet.add(entryId);
      return newSet;
    });
  };

  const handleCategoryEdit = (category: CategoryEntity) => {
    navigation.navigate('EditCategory', { category });
  };

  const handleEntryEdit = (entry: EntryEntity) => {
    navigation.navigate('EditEntry', { entry });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching entries</Text>;

  return (
    <View style={[styles.container, { width: screenWidth * 0.5 }]}>
      <Text style={{ fontSize: 40, fontWeight: "600", textAlign: 'center' }}>Entry List</Text>
      <View style={[styles.container, { paddingTop: 30 }, { width: "140%" }]}>
        <View style={styles.listContainer}>
          {Object.keys(groupedEntries).map((categoryId) => {
            const categoryEntries = groupedEntries[categoryId];
            const category = categoryEntries[0].category;

            return (
              <View key={categoryId} style={styles.categoryContainer}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <TouchableOpacity onPress={() => handleCategoryEdit(category)}>
                    <Text style={styles.dots}>•••</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={categoryEntries}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.todoItemContainer}>
                      <TouchableOpacity style={styles.todoItem}>
                        <View style={styles.checkboxContainer}>
                          <TouchableOpacity onPress={() => handleToggleSelect(item.id)}>
                            <View style={[styles.checkboxOuter, selectedEntries.has(item.id) && styles.checkboxOuterSelected]}>
                              {selectedEntries.has(item.id) && <View style={styles.checkboxInner} />}
                            </View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.checkboxText,
                              selectedEntries.has(item.id) && styles.selectedText,
                            ]}
                          >
                            {item.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.dotsContainer}>
                        <TouchableOpacity onPress={() => handleEntryEdit(item)}>
                          <Text style={styles.dots}>•••</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
              </View>
            );
          })}
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
    paddingTop: 100,
  },

  listContainer: {
    width: "130%",
    marginTop: 10,
    padding: 10,
  },

  categoryContainer: {
    marginBottom: 20,
    width: "100%",
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoryTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10
  },

  dots: {
    fontSize: 20,
    color: 'grey',
  },

  todoItemContainer: {
    backgroundColor: "#f9f9f9",
    width: "95%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: "auto"
  },

  todoItem: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    marginRight: 10,
  },

  checkboxOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxOuterSelected: {
    borderColor: 'blue',
  },

  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'blue',
  },

  checkboxText: {
    fontSize: 25,
  },

  selectedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },

  amountText: {
    fontSize: 20,
    color: "blue",
  },

  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
