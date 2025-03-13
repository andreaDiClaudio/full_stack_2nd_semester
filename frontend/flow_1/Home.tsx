import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './utils/types';
import { Center } from '@gluestack-ui/config/build/theme';

export class EntryEntity {
  constructor(
    public id: number,
    public title: string,
    public amount: number,
    public categoryId: number,
    public category: { id: number; title: string }
  ) { }
}

export default function Entries() {
  const { width: screenWidth } = Dimensions.get("window");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const [entries, setEntries] = useState<EntryEntity[]>([]);
  const [groupedEntries, setGroupedEntries] = useState<Record<string, EntryEntity[]>>({});
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set()); // Track selected entries

  // Fetch entries on component load
  useEffect(() => {
    fetchEntries();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchEntries();
    }, [])
  );

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:3000/entry');
      const data = await response.json();
      setEntries(data.data);
      groupEntriesByCategory(data.data);  // Fix grouping by category.id
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  // Group entries by category
  const groupEntriesByCategory = (entries: EntryEntity[]) => {
    const grouped: Record<string, EntryEntity[]> = {};
    entries.forEach((entry) => {
      const categoryId = entry.category ? entry.category.id.toString() : null;  // Access category.id
      if (categoryId) {
        if (!grouped[categoryId]) {
          grouped[categoryId] = [];
        }
        grouped[categoryId].push(entry);
      }
    });
    setGroupedEntries(grouped);
  };

  // Handle edit and delete actions
  const handleEdit = (item: EntryEntity) => {
    Alert.alert('Edit Entry', `Edit ${item.title}`);
    // Navigate to edit screen
    //TODO
    // navigation.navigate('Edit', { entryId: item.id, entryTitle: item.title, categoryId: item.categoryId });
  };

  const handleDelete = (item: EntryEntity) => {
    Alert.alert('Delete Entry', `Are you sure you want to delete ${item.title}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          // Handle delete logic here
          console.log('Deleted entry', item.id);
          // Remove the entry from state or call API to delete
        },
      },
    ]);
  };

  // Handle checkbox selection
  const handleToggleSelect = (entryId: number) => {
    setSelectedEntries((prevSelectedEntries) => {
      const newSelectedEntries = new Set(prevSelectedEntries);
      if (newSelectedEntries.has(entryId)) {
        newSelectedEntries.delete(entryId);  // Deselect
      } else {
        newSelectedEntries.add(entryId);  // Select
      }
      return newSelectedEntries;
    });
  };

  // Function to handle item press
  const handlePressEntry = (entry: EntryEntity) => {
    console.log('Entry pressed:', entry);
    // TODO fix 
    //navigation.navigate('Edit', { entryId: entry.id, entryTitle: entry.title, categoryId: entry.categoryId });
  };

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
                  <TouchableOpacity onPress={() => console.log('Category options')}>
                    <Text style={styles.dots}>•••</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={true}
                  data={categoryEntries}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.todoItemContainer}>
                      <TouchableOpacity onPress={() => handlePressEntry(item)} style={styles.todoItem}>
                        <View style={styles.checkboxContainer}>
                          <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => handleToggleSelect(item.id)}
                          >
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
                        <Text style={styles.amountText}>{item.amount}</Text>
                      </TouchableOpacity>
                      <View style={styles.dotsContainer}>
                      <TouchableOpacity
                        onPress={() => handleEdit(item)}
                        style={styles.actionButton}
                      >
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
    paddingRight:10
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
