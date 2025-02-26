import express from 'express';
import { FavoriteFoods, Users } from '../models/init.js';

const router = express.Router();

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

// TESTING: get all favorite foods
router.get('/', async (req, res) => {
    try {
        const favoriteFoods = await FavoriteFoods.findAll();
        console.log(favoriteFoods);
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