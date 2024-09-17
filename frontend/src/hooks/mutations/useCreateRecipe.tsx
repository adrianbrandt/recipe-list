import { useMutation, useQueryClient } from '@tanstack/react-query';

// Function to create a new recipe
const createRecipe = async (recipe: FormData) => {
    const response = await fetch('/api/recipe', {
        method: 'POST',
        body: recipe,
    });
    if (!response.ok) throw new Error('Failed to create recipe');
    return response.json();
};

// Custom hook for creating a recipe
export const useCreateRecipe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['recipes']}); // Invalidate the cache to refetch the recipes
        },
    });
};
