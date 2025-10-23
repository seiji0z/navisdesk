const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET all users with filters
router.get('/', async (req, res) => {
  try {
    const { search, role, status } = req.query;
    
    let query = { role: { $in: ['Admin', 'OSAS Officer', 'Student Org'] } };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== '') {
      query.role = role;
    }
    
    if (status && status !== '') {
      query.status = status;
    }
    
    const users = await User.find(query).sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;