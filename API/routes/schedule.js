import express from 'express';
import ScheduleItems from '../models/scheduleItems.js';

const router = express.Router();

router.get('/:diningHallId/:date', async (req, res) => {
    try {
        // FROM REQUEST:
            // grab dining hall
            // grab date
        const diningHallId = parseInt(req.params.diningHallId);
        const date = req.params.date;
        
        // Use request parameters to query schedule
        // return menu for the day for that dining hall
        const schedule = await ScheduleItems.findAll({
            where: {
                dininghallid: diningHallId,
                scheduledate: date
            }
        });
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