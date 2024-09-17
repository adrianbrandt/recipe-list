import { useQuery } from '@tanstack/react-query';

// Fetch a single recipe by ID
const fetchRecipe = async (id: string) => {
    const response = await fetch(`/api/recipe/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

// Custom hook to fetch a specific recipe
export const useRecipe = (id: string) => {
    return useQuery({
        queryKey: ['recipe', id],
        queryFn: () => fetchRecipe(id),
        staleTime: 5 * 60 * 1000, // Cache the recipe for 5 minutes
    });
};
