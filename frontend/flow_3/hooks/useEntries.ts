// hooks/useEntries.ts
import { EntryEntity } from '@/flow_2/entity/EntryEntity';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://192.168.0.87:3000/entry';

const fetchEntries = async (): Promise<EntryEntity[]> => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const useEntries = () => {
  return useQuery({
    queryKey: ['entries'],
    queryFn: fetchEntries,
  });
};
