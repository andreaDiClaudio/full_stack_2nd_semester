import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './utils/types';

export class EntryEntity {
  constructor(
    public id: number,
    public title: string,
    public amount: number,
    public categoryId: number,
    public category: { id: number; title: string }
  ) {}
}

export default function Entries() {
  const { width: screenWidth } = Dimensions.get("window");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const [entries, setEntries] = useState<EntryEntity[]>([]);
  const [groupedEntries, setGroupedEntries] = useState<Record<string, EntryEntity[]>>({});

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

  //TODO 
  // - create two, one for categories, one for entry.
  // - update ui so that there is an edit / delete icon next to category 
  // - update ui so that there is an edit / delete icon next to entry

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
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={true}
                  data={categoryEntries}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePressEntry(item)} style={styles.todoItem}>
                      <Text style={styles.checkboxText}>{item.title}</Text>
                      <Text style={styles.amountText}>{item.amount}</Text>
                    </TouchableOpacity>
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
    width: "100%",
    marginTop: 10,
    padding: 10,
  },

  categoryContainer: {
    marginBottom: 20,
    width: "100%",
  },

  categoryTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  todoItem: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  checkboxText: {
    fontSize: 25,
  },

  amountText: {
    fontSize: 20,
    color: "blue",
  },
});
