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

router.get('/:hall', (req, res) => {
  const hall = req.params.hall;
  res.status(200).send({
      'hall': hall,
      'menu': {
          'breakfast': {
              'station1': [
                  {
                      'name': 'Pizza',
                      'ingredients': ['cheese', 'tomato sauce', 'dough'],
                      'allergens': ['dairy', 'wheat'],
                      'vegan': false
                  },
                  {
                      'name': 'Salad',
                      'ingredients': ['lettuce', 'tomato', 'carrot', 'dressing'],
                      'allergens': [],
                      'vegan': true
                  },
                  {
                      'name': 'Pasta',
                      'ingredients': ['pasta', 'sauce'],
                      'allergens': ['wheat'],
                      'vegan': false
                  }
              ],
              'station2': [

              ],
              'station3': [

              ],
          },
          'lunch': [

          ],
          'dinner': [

          ],
      }
  });
});

export default router;