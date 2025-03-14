import { CategoryEntity } from "../CategoryEntity";

export type RootStackParamList = {
  Home: undefined;
  EditCategory: { category: CategoryEntity };
  EditEntry: { entryId: string }; 
  Delete: { 
    entityId: number; 
    entityTitle: string; 
    entityType: 'category' | 'entry' 
  };
};