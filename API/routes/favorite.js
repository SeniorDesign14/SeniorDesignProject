import express from 'express';
import { FavoriteFoods, Users } from '../models/init.js';
import sequelize from 'sequelize';

const router = express.Router();

// Create a favorite food
router.post('/', async (req, res) => {
    try {
        const { netid, foodid, food, dininghallid } = req.body;
        const favoriteFood = await FavoriteFoods.create({
            netid,
            foodid,
            food,
            dininghallid
        });
        res.status(201).send({
            favoriteFood
        });
    } catch (error) {
        console.error('Error creating favorite food:', error);
        res.status(500).send({
            error: 'Failed to create favorite food.'
        });
    }
});

// remove favorite food
router.delete('/:netid/:foodid', async (req, res) => {
    try {
        const { netid, foodid } = req.params;
        const deletedFood = await FavoriteFoods.destroy({
            where: {
                netid,
                foodid
            }
        });
        if (deletedFood) {
            res.status(200).send({
                message: 'Favorite food deleted successfully.'
            });
        } else {
            res.status(404).send({
                message: 'Favorite food not found.'
            });
        }
    } catch (error) {
        console.error('Error deleting favorite food:', error);
        res.status(500).send({
            error: 'Failed to delete favorite food.'
        });
    }
});

// get the top 5 favorite foods (sorted by count and alphabetically)
router.get('/top5', async (req, res) => {
    try {
        const favoriteFoods = await FavoriteFoods.findAll({
            attributes: [
                'food',
                [sequelize.fn('COUNT', sequelize.col('food')), 'count'] // Count occurrences of each food
            ],
            group: ['food'], // Group by food
            order: [[sequelize.literal('count'), 'DESC'], ['food', 'ASC']], // Order by count and alphabetically
            limit: 5
        });
        res.status(200).send({
            favoriteFoods
        });
    } catch (error) {
        console.error('Error fetching top 5 favorite foods:', error);
        res.status(500).send({
            error: 'Failed to fetch top 5 favorite foods.'
        });
    }
});

// get all favorite foods from a user
router.get('/:netid', async (req, res) => {
    try {
        const { netid } = req.params;
        const favoriteFoods = await FavoriteFoods.findAll({
            where: {
                netid
            }
        });
        res.status(200).send({
            favoriteFoods
        });
    } catch (error) {
        console.error('Error fetching favorite foods:', error);
        res.status(500).send({
            error: 'Failed to fetch favorite foods.'
        });
    }
});

export default router;