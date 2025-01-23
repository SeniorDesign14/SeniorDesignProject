import express from 'express';
import ScheduleItems from '../models/scheduleItems.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // FROM REQUEST:
            // grab dining hall
            // grab date
        
        // Use request parameters to query schedule
        // return menu for the day for that dining hall
        
        const schedule = await ScheduleItems.findAll(); // Wait for the data
        res.status(200).send({
            schedule // Send the data in the response
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).send({
            error: 'Failed to fetch schedule.'
        });
    }
});

export default router;