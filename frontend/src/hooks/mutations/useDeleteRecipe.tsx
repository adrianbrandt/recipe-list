import { useMutation, useQueryClient } from '@tanstack/react-query';

// Function to delete a recipe
const deleteRecipe = async (id: string) => {
    const response = await fetch(`/api/recipe/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete recipe');
};

// Custom hook to delete a recipe
export const useDeleteRecipe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRecipe,
        onSuccess: () => {
            // Invalidate and refetch the recipes after a successful delete
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
};
