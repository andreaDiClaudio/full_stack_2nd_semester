import { CategoryEntity } from "../CategoryEntity";

export type RootStackParamList = {
  Home: undefined;
  EditCategory: { categoryId: string };
  EditEntry: { entryId: string }; 
  Delete: { 
    entityId: number; 
    entityTitle: string; 
    entityType: 'category' | 'entry' 
  };
};