import Recipe from '../models/Recipe';
import logger from "../utils/logger";

class RecipeService {
    private formatTimeToMake(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h:${mins}m`;
    }

    async createRecipe(data: {
        name: string;
        ingredients: Array<{ name: string, amount: number, unit: string }>;
        instructions: string;
        timeToMake: number;
        difficulty: 'enkel' | 'middels' | 'avansert';
        servings: number;
        steps: string[];
        imagePath: string | null;
    }) {
        const { name, ingredients, instructions, timeToMake, difficulty, servings, steps, imagePath } = data;

        try {
            if (!Array.isArray(steps)) {
                throw new Error('Steps must be an array');
            }


            const recipe = await Recipe.create({
                name,
                ingredients,
                instructions,
                timeToMake,
                difficulty,
                servings,
                steps,
                imagePath,
            });

            return {
                ...recipe.toJSON(),
                timeToMake: this.formatTimeToMake(timeToMake),
            };
        } catch (error) {
            console.error('Error creating recipe in service:', error);
            throw error;
        }
    }

    async updateRecipe(
        id: string,
        data: {
            name: string;
            ingredients: Array<{ name: string, amount: number, unit: string }>;
            instructions: string;
            timeToMake: number;
            difficulty: 'enkel' | 'middels' | 'avansert';
            servings: number;
            steps: string[];
            imagePath?: string | null;
        }
    ) {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) return null;

        const { name, ingredients, instructions, timeToMake, difficulty, servings, steps, imagePath } = data;
        recipe.name = name;
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;
        recipe.timeToMake = timeToMake;
        recipe.difficulty = difficulty;
        recipe.servings = servings;
        recipe.steps = steps; // Include steps in the update operation
        if (imagePath) recipe.imagePath = imagePath;
        await recipe.save();

        return {
            ...recipe.toJSON(),
            timeToMake: this.formatTimeToMake(timeToMake),
        };
    }


    async deleteRecipe(id: string) {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) return null;

        await recipe.destroy();
        return recipe;
    }

    async getAllRecipes() {
        const recipes = await Recipe.findAll();
        return recipes.map(recipe => ({
            ...recipe.toJSON(),
            timeToMake: this.formatTimeToMake(recipe.timeToMake),
        }));
    }

    async getRecipeById(id: string) {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) return null;
        return {
            ...recipe.toJSON(),
            timeToMake: this.formatTimeToMake(recipe.timeToMake),
        };
    }
}

export default new RecipeService();
