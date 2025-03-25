import express from 'express';
import { FavoriteFoods, Users } from '../models/init.js';

const router = express.Router();

// Create a favorite food
router.post('/', async (req, res) => {
    try {
        const { userid, foodid, food, dininghallid } = req.body;
        const favoriteFood = await FavoriteFoods.create({
            userid,
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

// TESTING: get all favorite foods from a user
router.get('/:userid', async (req, res) => {
    try {
        const { userid } = req.params;
        const favoriteFoods = await FavoriteFoods.findAll({
            where: {
                userid
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