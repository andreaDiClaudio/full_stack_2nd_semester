import { EntryEntity } from "@/flow_2/entity/EntryEntity";
import { CategoryEntity } from "../CategoryEntity";

export type RootStackParamList = {
  Home: undefined;
  EditCategory: { category: CategoryEntity };
  EditEntry: { entry: EntryEntity };
  Login: undefined;
  SignupScreen: undefined
};