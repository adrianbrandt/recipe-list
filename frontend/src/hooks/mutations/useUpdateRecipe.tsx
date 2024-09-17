import { useMutation, useQueryClient } from '@tanstack/react-query';

// Function to update an existing recipe
const updateRecipe = async ({ id, formData }: { id: string, formData: FormData }) => {
    const response = await fetch(`/api/recipe/${id}`, {
        method: 'PUT',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to update recipe');
    return response.json();
};

// Custom hook for updating a recipe
export const useUpdateRecipe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
};
