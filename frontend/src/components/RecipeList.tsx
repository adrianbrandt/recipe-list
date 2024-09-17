import React from 'react';
import { useRecipes } from '../hooks/query/useRecipes';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const RecipeList: React.FC = () => {
    const { data: recipes = [], error, isLoading } = useRecipes();

    if (isLoading) return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    if (error) return <div className="alert alert-danger">Error loading recipes</div>;

    return (
        <div>
            <h1>Recipes</h1>
            {recipes.length === 0 ? (
                <div className="alert alert-info">No recipes found</div>
            ) : (
                <ul className="list-group">
                    {recipes.map((recipe: any) => (
                        <li key={recipe.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <img
                                    src={`http://localhost:3000/${recipe.imagePath}`}
                                    alt={recipe.name}
                                    style={{ width: '100px', marginRight: '15px' }}
                                />
                                <span>{recipe.name} - {recipe.timeToMake}</span>
                            </div>
                            <div>
                                <Link className="btn btn-sm btn-primary mr-2" to={`/edit/${recipe.id}`}>
                                    Edit
                                </Link>
                                <Link className="btn btn-sm btn-info ml-2" to={`/recipe/${recipe.id}`}>
                                    View
                                </Link>
                                <button className="btn btn-sm btn-danger ml-2">
                                    {/* //TODO: delete button */}
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecipeList;
