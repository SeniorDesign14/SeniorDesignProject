import express from 'express';
// import DiningHalls from '../models/init.js';
// import DiningHours from '../models/init.js';
import { DiningHalls, DiningHours } from '../models/init.js';

const router = express.Router();

// all routes here begin with '/dininghalls'
router.get('/', async (req, res) => {
    try {
        const diningHalls = await getDiningHallsAndHours(); // Wait for the data
        console.log(diningHalls); // Logs the data retrieved
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

async function getDiningHallsAndHours() {
    // Get all dining halls with their hours
    const diningHalls = await DiningHalls.findAll({
        include: {
            model: DiningHours,
            as: 'hours'
        }
    });

    // Sort the dining halls by dininghallid
    diningHalls.sort((a, b) => a.dininghallid - b.dininghallid);

    return diningHalls;
}

export default router;