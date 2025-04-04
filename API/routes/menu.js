import express from 'express';
import { Menu } from '../models/init.js';

const router = express.Router();

// get all menu items
router.get('/', async (req, res) => {
    try {
        const menu = await Menu.findAll();
        res.status(200).send({
            menu
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).send({
            error: 'Failed to fetch menu.'
        });
    }
});

export default router;