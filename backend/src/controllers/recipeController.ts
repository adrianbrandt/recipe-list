import { Request, Response } from 'express';
import RecipeService from '../services/recipeService';
import logger from "../utils/logger";

export const createRecipe = async (req: Request, res: Response) => {
    const { name, ingredients, instructions, timeToMake, difficulty, servings, steps } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;
    
    if (!name || !ingredients || !instructions || !timeToMake || !difficulty || !servings || !steps) {
        return res.status(400).json({ error: 'Missing required fields or incorrect format' });
    }

    try {
        const recipe = await RecipeService.createRecipe({
            name,
            ingredients,
            instructions,
            timeToMake,
            difficulty,
            servings,
            steps,
            imagePath,
        });
        res.status(201).json(recipe);
    } catch (error) {
        logger.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
};

export const updateRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, ingredients, instructions, timeToMake, difficulty, servings, steps } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    if (!name || !ingredients || !instructions || !timeToMake || !difficulty || !servings || !steps) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const recipe = await RecipeService.updateRecipe(id, {
            name,
            ingredients,
            instructions,
            timeToMake,
            difficulty,
            servings,
            steps,
            imagePath,
        });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update recipe' });
        logger.error('Error updating recipe:', error);
    }
};

export const deleteRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const recipe = await RecipeService.deleteRecipe(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recipe' });
        logger.error('Failed to delete recipe:', error)
    }
};

export const getRecipes = async (req: Request, res: Response) => {
    try {
        const recipes = await RecipeService.getAllRecipes();
        logger.info(recipes)
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

export const getRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const recipe = await RecipeService.getRecipeById(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipe' });
        logger.error('Failed to fetch recipe: ', error)
    }
};
