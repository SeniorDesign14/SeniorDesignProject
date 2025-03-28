import express from 'express';
import Users from '../models/users.js'; // make sure this path is correct

const router = express.Router();

router.get('/', async (req, res) => {
  try {
      const users = await Users.findAll(); // this is DB query (select * from users)
      console.log(users);
      res.status(200).send({
          users
      });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send({
          error: 'Failed to fetch users.'
      });
  }
});

router.get('/whoami', async (req, res) => {
  const netid = req.userNetID;

  if (!netid) {
    return res.status(401).json({ error: 'Not authenticated (no NetID)' });
  }

  try {
    const [user, created] = await Users.findOrCreate({
      where: { netid: netid },
      defaults: {
        isstudent: true,  // hardcoded, but I forget our use for this
        email: null
      }
    });

    res.status(200).json({
      netid,
      created,
      user
    });

  } catch (error) {
    console.error('Error inserting user:', error.message);
    res.status(500).json({ error: 'Failed to insert or fetch user.' });
  }
});

export default router;
