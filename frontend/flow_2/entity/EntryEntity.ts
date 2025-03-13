// In flow_2/entity/EntryEntity.ts
export interface EntryEntity {
    id: number;
    title: string;
    amount: number;
    categoryId: number;
    category: { id: number; title: string };
  }
  