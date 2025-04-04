import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    if (req.userNetID) {
        res.status(200).send({netid: req.userNetID});
    } else {
        res.status(401).send({ error: 'Not Authenticated' });
    }
});

export default router;