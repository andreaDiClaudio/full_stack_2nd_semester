export type RootStackParamList = {
  Home: undefined;
  Edit: {
    categoryId: number,
    categoryTitle: string
  };
  Delete: {
    categoryId: number,
    categoryTitle: string
  };
};