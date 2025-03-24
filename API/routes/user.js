import express from 'express';
import { Users } from '../models/init.js';

const router = express.Router();

// TESTING: get all users
router.get('/', async (req, res) => {
    try {
        const users = await Users.findAll();
        console.log(users);
        res.status(200).send({
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({
            error: 'Failed to fetch users.'
        });
    }
});

export default router;