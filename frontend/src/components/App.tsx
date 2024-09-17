import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './RecipeList';
import RecipeForm from './RecipeForm';
import RecipeDetails from './RecipeDetails';
import Navbar from './Navbar';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<RecipeList />} />
                    <Route path="/create" element={<RecipeForm />} />
                    <Route path="/edit/:id" element={<RecipeForm />} />
                    <Route path="/recipe/:id" element={<RecipeDetails />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
