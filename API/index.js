import express, { json } from 'express';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(json());

app.listen(PORT, () => {
    console.log(`Server Listening on http://localhost:${PORT}`)
});

app.get('/status', (req, res) => {
    res.status(200).send({'body': 'The server is running!'});
});

// Set up endpoints

// Get dining halls
app.get('/dininghalls', (req, res) => {
    res.status(200).send({
        'halls': [
            {
                'name': 'Connecticut',
                'hours': 
                    {
                    'breakfast': '7:00am - 10:00am', 
                    'lunch': '11:00am - 2:00pm', 
                    'dinner': '5:00pm - 8:00pm'
                    },
                'open': true
            },
            {
                'name': 'McMahon',
                'hours': 
                    {
                    'breakfast': '7:00am - 10:00am', 
                    'lunch': '11:00am - 2:00pm', 
                    'dinner': '5:00pm - 8:00pm'
                    },
                'open': true
            },
            {
                'name': 'South',
                'hours':
                    {
                    'breakfast': '7:00am - 10:00am', 
                    'lunch': '11:00am - 2:00pm', 
                    'dinner': '5:00pm - 8:00pm',
                    'late night': '9:00pm - 12:00am'
                    },
                'open': true
            }
        ]
    });
});

// Get menu for a dining hall
app.get('/dininghalls/:hall', (req, res) => {
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