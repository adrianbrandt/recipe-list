import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecipe } from '../hooks/query/useRecipe';
import Spinner from 'react-bootstrap/Spinner';

const RecipeDetails: React.FC = () => {
    const { id } = useParams();
    const { data: recipe, error, isLoading } = useRecipe(id!);
    const [servings, setServings] = useState(recipe?.servings || 4); // Default to 4 servings
    const [completedSteps, setCompletedSteps] = useState<string[]>([]); // Track completed steps

    if (isLoading) return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    if (error) return <div className="alert alert-danger">Error loading recipe</div>;

    // Adjust ingredient quantities based on servings
    const adjustIngredients = (factor: number) => {
        if (recipe?.ingredients) {
            return recipe.ingredients.map((ingredient: { name: string; amount: number; unit: string }) => ({
                ...ingredient,
                amount: (ingredient.amount * factor).toFixed(2), // Fixed to 2 decimal points for precision
            }));
        }
        return [];
    };

    const handleServingsChange = (newServings: number) => {
        if (newServings > 0) {
            setServings(newServings);
        }
    };

    const toggleStep = (step: string) => {
        if (completedSteps.includes(step)) {
            setCompletedSteps(completedSteps.filter(s => s !== step));
        } else {
            setCompletedSteps([...completedSteps, step]);
        }
    };

    const factor = servings / recipe?.servings;
    const adjustedIngredients = adjustIngredients(factor);

    return (
        <div className="recipe-details">
            {/* Full width image */}
            <div className="recipe-image">
                {recipe.imagePath && (
                    <img
                        src={`http://localhost:3000/${recipe.imagePath}`}
                        alt={recipe.name}
                        className="img-fluid"
                        style={{ width: '100%' }}
                    />
                )}
            </div>

            <div className="recipe-content d-flex mt-4">
                {/* Left column: Save buttons and ingredient adjustment */}
                <div className="left-column" style={{ width: '25%', paddingRight: '20px' }}>
                    <div className="save-buttons mb-4">
                        <button className="btn btn-success btn-block mb-2">Lagre</button>
                        <button className="btn btn-secondary btn-block mb-2">Legg i handlelisten</button>
                        <button className="btn btn-secondary btn-block">Legg i ukeplanen</button>
                    </div>

                    <div className="ingredients-section">
                        <h5>INGREDIENSER</h5>
                        <div className="servings-control d-flex align-items-center mb-3">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleServingsChange(servings - 1)}
                                disabled={servings <= 1}
                            >
                                -
                            </button>
                            <span className="mx-3">{servings} PORSJONER</span>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleServingsChange(servings + 1)}
                            >
                                +
                            </button>
                        </div>

                        <ul className="list-group">
                            {adjustedIngredients.map((ingredient: { name: string; amount: number; unit: string }, index: number) => (
                                <li key={index} className="list-group-item">
                                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right column: Recipe details */}
                <div className="right-column" style={{ width: '75%' }}>
                    <h1>{recipe.name}</h1>
                    <p>{recipe.instructions}</p>

                    {/* Steps section */}
                    <h3>Steps:</h3>
                    <ul className="list-group">
                        {recipe.steps.map((step: string, index: number) => (
                            <li key={index} className="list-group-item d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    className="mr-3"
                                    checked={completedSteps.includes(step)}
                                    onChange={() => toggleStep(step)}
                                />
                                <span className={completedSteps.includes(step) ? 'text-muted' : ''}>
                                    {index + 1}. {step}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Time and Difficulty */}
                    <div className="recipe-info d-flex align-items-center mt-4">
                        <span className="time-to-make mr-3">
                            <i className="fa fa-clock-o"></i> {recipe.timeToMake}
                        </span>
                        <span className="difficulty">
                            <i className="fa fa-signal"></i> {recipe.difficulty}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;
