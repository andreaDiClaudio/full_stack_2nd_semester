// hooks/useCreateEntry.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type EntryData = {
  title: string;
  amount: number;
  categoryId: string;
};

export const useCreateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryData: EntryData) => {
      const response = await axios.post('http://192.168.0.87:3000/entry', entryData);
      return response.data;
    },
    onSuccess: () => {
      // Optionally invalidate or refetch entries after a successful mutation
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });
};
