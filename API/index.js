import express, { json } from 'express';
import dininghallsRoutes from './routes/dininghalls.js';
import scheduleRoutes from './routes/schedule.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(json());

app.listen(PORT, () => {
    console.log(`Server Listening on http://localhost:${PORT}`)
});

app.use('/dininghalls', dininghallsRoutes);

app.use('/schedule', scheduleRoutes);

app.get('/status', (req, res) => {
    res.status(200).send({'body': 'The server is running!'});
});