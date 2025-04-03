import express from 'express';
import { NutritionalInfo } from '../models/init.js';

const router = express.Router();

// nutritional info based on foodid
router.get('/:foodid', async (req, res) => {
    try {
        const foodid = req.params.foodid;
        const nutritionalInfo = await NutritionalInfo.findByPk(foodid);
        if (nutritionalInfo) {
            res.status(200).send({
                nutritionalInfo
            });
        } else {
            res.status(404).send({
                error: 'Nutritional info not found.'
            });
        }
    } catch (error) {
        console.error('Error fetching nutritional info:', error);
        res.status(500).send({
            error: 'Failed to fetch nutritional info.'
        });
    }
});

export default router;