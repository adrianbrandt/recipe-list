import { DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

class Recipe extends Model {
    declare id: number;
    declare name: string;
    declare ingredients: Array<{ name: string, amount: number, unit: string }>;
    declare instructions: string;
    declare timeToMake: number;
    declare difficulty: 'enkel' | 'middels' | 'avansert';
    declare servings: number;
    declare steps: string[];
    declare imagePath: string | null;

    static initModel(sequelize: Sequelize) {
        Recipe.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: UUIDV4,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                ingredients: {
                    type: DataTypes.JSONB,
                    allowNull: false,
                },
                instructions: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                timeToMake: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                difficulty: {
                    type: DataTypes.ENUM('enkel', 'middels', 'avansert'),
                    allowNull: false,
                },
                servings: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                imagePath: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                steps: {
                    type: DataTypes.ARRAY(DataTypes.TEXT),
                    allowNull: false,
                }
            },
            {
                sequelize,
                modelName: 'Recipe',
            }
        );
    }
}

export default Recipe;
