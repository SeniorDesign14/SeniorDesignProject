import express from 'express';
import { ScheduleItems, DiningStations } from '../models/init.js';

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
        const schedule = await getScheduleWithStations(diningHallId, date);
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

async function getScheduleWithStations(diningHallId, date) {
    // Get all schedule items for a dining hall on a specific date
    const schedule = await ScheduleItems.findAll({
        where: {
            dininghallid: diningHallId,
            scheduledate: date
        },
        include: {
            model: DiningStations,
            as: 'station'
        }
    });

    return schedule;
}

export default router;