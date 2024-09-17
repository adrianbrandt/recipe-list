import { Router } from 'express';
import { createRecipe, updateRecipe, deleteRecipe, getRecipes, getRecipe } from '../controllers/recipeController';
import upload from '../middleware/upload';

const router = Router();

router.post('/', upload.single('image'), createRecipe);
router.put('/:id', upload.single('image'), updateRecipe);
router.delete('/:id', deleteRecipe);
router.get('/', getRecipes);
router.get('/:id', getRecipe);

export default router;
