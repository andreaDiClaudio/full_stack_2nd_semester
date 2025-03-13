import { CategoryEntity } from "../CategoryEntity";

export type RootStackParamList = {
  Home: undefined;
  Edit: { 
    entityId: number; 
    entityTitle: string; 
    amount?: number,
    category?: CategoryEntity
    entityType: 'category' | 'entry';
  };
  Delete: { 
    entityId: number; 
    entityTitle: string; 
    entityType: 'category' | 'entry' 
  };
};