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

// get all images
router.get('/images', async (req, res) => {
    try {
        const images = await FoodImages.findAll({
            attributes: ['foodid'] // Include foodid and image attributes
        });
        res.status(200).send({
            images: images.map(image => ({
                foodid: image.foodid,
                imageUrl: `http://huskyhotspot.cse.uconn.edu:3000/menu/image/${image.foodid}` // Construct the image URL
            }))
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).send({
            error: 'Failed to fetch images.'
        });
    }
});

// Serve individual images by foodid
router.get('/image/:foodid', async (req, res) => {
    try {
        const { foodid } = req.params;
        const menuItem = await FoodImages.findOne({
            where: { foodid },
            attributes: ['image']
        });

        if (menuItem && menuItem.image) {
            res.set('Content-Type', 'image/png'); // Set the correct content type
            res.status(200).send(menuItem.image); // Send the image buffer
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