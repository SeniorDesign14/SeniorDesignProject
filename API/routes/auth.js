import express from 'express';

const router = express.Router();

router.get('/user', (req, res) => {
    if (req.userNetID) {
        res.status(200).send({netid: req.userNetID});
    } else {
        res.status(401).send({ error: 'Not Authenticated' });
    }
});

export default router;