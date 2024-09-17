import { Router } from 'express';
import recipeRoutes from "./recipeRoutes";

const router = Router();


router.use('/recipe', recipeRoutes);

export default router;
