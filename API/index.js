import express, { json } from 'express';
import dininghallsRoutes from './routes/dininghalls.js';
import scheduleRoutes from './routes/schedule.js';
import userRoutes from './routes/user.js';
import favoriteRoutes from './routes/favorite.js';
import cors from 'cors';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server Listening on http://localhost:${PORT}`)
});

app.use('/dininghalls', dininghallsRoutes);

app.use('/schedule', scheduleRoutes);

app.use('/user', userRoutes);

app.use('/favorite', favoriteRoutes);

app.get('/status', (req, res) => {
    res.status(200).send({'body': 'The server is running!'});
});