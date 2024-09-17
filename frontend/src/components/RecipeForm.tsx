import React, { useState, useEffect } from 'react';
import { useCreateRecipe } from '../hooks/mutations/useCreateRecipe';
import { useUpdateRecipe } from '../hooks/mutations/useUpdateRecipe';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipe } from '../hooks/query/useRecipe';

const RecipeForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const { data: recipe, isLoading } = useRecipe(id || ''); // Load existing recipe if editing

    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', amount: 0, unit: 'g' }]); // Default unit to 'g'
    const [instructions, setInstructions] = useState('');
    const [timeToMake, setTimeToMake] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [difficulty, setDifficulty] = useState('middels');
    const [servings, setServings] = useState(4);
    const [steps, setSteps] = useState(['']); // Step by step field

    const createRecipe = useCreateRecipe();
    const updateRecipe = useUpdateRecipe();
    const navigate = useNavigate();

    // Pre-fill form with existing recipe data when editing
    useEffect(() => {
        if (recipe && isEditing) {
            setName(recipe.name);
            setIngredients(recipe.ingredients || [{ name: '', amount: 0, unit: 'g' }]);
            setInstructions(recipe.instructions);
            setTimeToMake(recipe.timeToMake);
            setDifficulty(recipe.difficulty);
            setServings(recipe.servings);
            setSteps(recipe.steps || ['']);
        }
    }, [recipe, isEditing]);

    // Handle adding a new ingredient
    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: 0, unit: 'g' }]); // Default unit to 'g'
    };

    // Handle removing an ingredient
    const handleRemoveIngredient = (index: number) => {
        const updatedIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(updatedIngredients);
    };

    // Handle changing an ingredient's value
    const handleIngredientChange = (index: number, field: string, value: string | number) => {
        const updatedIngredients = ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        setIngredients(updatedIngredients);
    };

    // Handle adding a new step
    const handleAddStep = () => {
        setSteps([...steps, '']);
    };

    // Handle removing a step
    const handleRemoveStep = (index: number) => {
        const updatedSteps = steps.filter((_, i) => i !== index);
        setSteps(updatedSteps);
    };

    // Handle changing a step's value
    const handleStepChange = (index: number, value: string) => {
        const updatedSteps = steps.map((step, i) => (i === index ? value : step));
        setSteps(updatedSteps);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('instructions', instructions);
        formData.append('timeToMake', timeToMake.toString());
        formData.append('difficulty', difficulty);
        formData.append('servings', servings.toString());
        formData.append('ingredients', JSON.stringify(ingredients)); // Pass ingredients as JSON
        formData.append('steps', JSON.stringify(steps)); // Pass steps as JSON
        if (image) formData.append('image', image);

        if (isEditing) {
            if (id) {
                updateRecipe.mutate({ id, formData }, { onSuccess: () => navigate('/') });
            }
        } else {
            createRecipe.mutate(formData, { onSuccess: () => navigate('/') });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>{isEditing ? 'Edit Recipe' : 'Create Recipe'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Recipe Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Instructions</label>
                    <textarea
                        className="form-control"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Time to Make (minutes)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={timeToMake}
                        onChange={(e) => setTimeToMake(Number(e.target.value))}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Difficulty</label>
                    <select
                        className="form-control"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                    >
                        <option value="enkel">Enkel</option>
                        <option value="middels">Middels</option>
                        <option value="avansert">Avansert</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Servings</label>
                    <input
                        type="number"
                        className="form-control"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                        required
                    />
                </div>

                {/* Ingredient Fields */}
                <h3>Ingredients</h3>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <input
                            type="text"
                            className="form-control mr-2"
                            placeholder="Ingredient Name"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            className="form-control mr-2"
                            placeholder="Amount"
                            value={ingredient.amount}
                            onChange={(e) => handleIngredientChange(index, 'amount', Number(e.target.value))}
                            required
                        />
                        <select
                            className="form-control mr-2"
                            value={ingredient.unit}
                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        >
                            <option value="ts">ts</option>
                            <option value="ss">ss</option>
                            <option value="stk">stk</option>
                            <option value="dl">dl</option>
                            <option value="g">g</option>
                        </select>
                        <button type="button" className="btn btn-danger" onClick={() => handleRemoveIngredient(index)}>
                            Remove
                        </button>
                    </div>
                ))}

                <button type="button" className="btn btn-secondary mb-3" onClick={handleAddIngredient}>
                    Add Ingredient
                </button>

                {/* Step Fields */}
                <h3>Steps</h3>
                {steps.map((step, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`Step ${index + 1}`}
                            value={step}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            required
                        />
                        <button type="button" className="btn btn-danger ml-2" onClick={() => handleRemoveStep(index)}>
                            Remove Step
                        </button>
                    </div>
                ))}

                <button type="button" className="btn btn-secondary mb-3" onClick={handleAddStep}>
                    Add Step
                </button>

                <div className="form-group">
                    <label>Upload Image</label>
                    <input type="file" className="form-control" onChange={handleImageChange} />
                </div>

                <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update Recipe' : 'Create Recipe'}
                </button>
            </form>
        </div>
    );
};

export default RecipeForm;
