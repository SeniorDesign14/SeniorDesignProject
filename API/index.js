import express, { json } from 'express';
import dininghallsRoutes from './routes/dininghalls.js';
import scheduleRoutes from './routes/schedule.js';
import usersRoutes from './routes/users.js';
import favoriteRoutes from './routes/favorite.js';
import menuRoutes from './routes/menu.js';
import nutritionalRoutes from './routes/nutritional.js';
import authuserRoutes from './routes/authuser.js';
import cors from 'cors';
import Users from './models/users.js';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server Listening on http://localhost:${PORT}`)
});

app.use(async (req, res, next) => {
    console.log("request header: ");
    console.log(req.headers);
    const netid = req.headers['remote_user'] || req.headers['REMOTE_USER'];
    
    console.log("REMOTE_USER: ", netid);
    if (typeof netid === 'string') {
        req.userNetID = netid;

        // save to DB
        try {
            await Users.findOrCreate({
                where: {netid: netid },
                defaults: {
                    isstudent: true
                }
            });
        } catch (error) {
            console.error('Error tracking CAS error', error.message);
        }
    }
    next(); // passes control to next route handler, otherwise request would never reach other routes
});

app.use('/authuser', authuserRoutes);

app.use('/dininghalls', dininghallsRoutes);

app.use('/schedule', scheduleRoutes);

app.use('/users', usersRoutes);

app.use('/favorite', favoriteRoutes);

app.use('/menu', menuRoutes);

app.use('/nutritional', nutritionalRoutes);

app.get('/status', (req, res) => {
    res.status(200).send({'body': 'The server is running!'});
});