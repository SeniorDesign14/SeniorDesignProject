import express from 'express';
import { Menu, FoodImages } from '../models/init.js';

const router = express.Router();

// get all menu items, without the image (because it is a blob, hence takes too long and lots of space)
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

// get the image of a specific menu item
router.get('/:foodid', async (req, res) => {
    try {
        const { foodid } = req.params;
        const menuItem = await FoodImages.findOne({
            where: { foodid },
            attributes: ['image']
        });

        if (menuItem && menuItem.image) {
            // Convert the image buffer to a Base64 string
            const base64Image = menuItem.image.toString('base64');
            res.status(200).send({
                image: `data:image/png;base64,${base64Image}` // Include the Base64 string with the MIME type
            });
        } else {
            res.status(404).send({
                error: 'Image not found.'
            });
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send({
            error: 'Failed to fetch image.'
        });
    }
});

export default router;