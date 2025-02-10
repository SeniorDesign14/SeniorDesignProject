import express from 'express';
import DiningHalls from '../models/diningHalls.js';

const router = express.Router();

// all routes here begin with '/dininghalls'
router.get('/', async (req, res) => {
    try {
        const diningHalls = await DiningHalls.findAll(); // Wait for the data
        console.log(diningHalls); // Logs the data retrieved
        diningHalls.sort((a, b) => a.dininghallid - b.dininghallid); // Sort the data by dininghallid
        res.status(200).send({
            diningHalls // Send the data in the response
        });
    } catch (error) {
        console.error('Error fetching dining halls:', error);
        res.status(500).send({
            error: 'Failed to fetch dining halls.'
        });
    }
});

export default router;