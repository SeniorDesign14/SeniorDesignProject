import express from 'express';
import { NutritionalInfo } from '../models/init.js';

const router = express.Router();

router.get('/:foodID', async (req, res) => {
    try {
        const foodID = req.params.foodID;
        
        // Query by foodID (integer)
        const nutritionalInfo = await NutritionalInfo.findOne({
            where: { foodID: foodID }
        });

        if (!nutritionalInfo) {
            return res.status(404).json({ error: "Nutritional info not found" });
        }

        res.status(200).send({ nutritionalInfo });
    } catch (error) {
        console.error('Error fetching nutritional info:', error);
        res.status(500).send({ error: 'Failed to fetch nutritional info.' });
    }
});

export default router;