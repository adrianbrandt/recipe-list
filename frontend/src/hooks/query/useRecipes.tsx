import { useQuery } from '@tanstack/react-query';

// Fetch all recipes from the API
const fetchRecipes = async () => {
    const response = await fetch('/api/recipe');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

// Custom hook to use the recipes query
export const useRecipes = () => {
    return useQuery({
        queryKey: ['recipes'],
        queryFn: fetchRecipes,
        staleTime: 5 * 60 * 1000, // Cache recipes for 5 minutes
    });
};
