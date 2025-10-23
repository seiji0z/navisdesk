const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and load existing data
mongoose.connect('mongodb://localhost:27017/navisdesk_db')
  .then(() => {
    console.log('MongoDB connected! Loading existing data...');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });

// Combined endpoint - loads from BOTH admin_osas AND student_organizations collections
app.get('/api/users', async (req, res) => {
  try {
    const { search, role, status } = req.query;
    
    // Load Admin/OSAS users
    const adminUsers = await mongoose.connection.db
      .collection('admin_osas')
      .find({ status: { $ne: 'Inactive' } }) // Only active users
      .toArray();
    
    // Load Student Organizations
    const studentOrgs = await mongoose.connection.db
      .collection('student_organizations')
      .find({ status: 'Active' })
      .toArray();

    // Combine and transform data
    let users = [
      ...adminUsers.map(user => ({
        _id: user._id.$oid,
        name: user.name,
        email: user.email,
        role: user.role === 'Admin' ? 'Admin' : 'OSAS Officer',
        status: user.status,
        dateRegistered: new Date(user.created_at).toLocaleDateString('en-US', { 
          month: '2-digit', day: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-'),
        lastLogin: user.last_log ? 
          new Date(user.last_log).toLocaleDateString('en-US', { 
            month: '2-digit', day: '2-digit', year: 'numeric' 
          }).replace(/\//g, '-') : 'N/A'
      })),
      ...studentOrgs.map(org => ({
        _id: org._id.$oid,
        name: org.name,
        email: org.email,
        role: 'Student Org',
        status: org.status,
        dateRegistered: new Date(org.created_at).toLocaleDateString('en-US', { 
          month: '2-digit', day: '2-digit', year: 'numeric' 
        }).replace(/\//g, '-'),
        lastLogin: org.last_log ? 
          new Date(org.last_log).toLocaleDateString('en-US', { 
            month: '2-digit', day: '2-digit', year: 'numeric' 
          }).replace(/\//g, '-') : 'N/A'
      }))
    ];

    // Apply filters
    if (search) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (role && role !== '') {
      users = users.filter(user => user.role === role);
    }
    
    if (status && status !== '') {
      users = users.filter(user => user.status === status);
    }

    // Sort by last login (newest first)
    users.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});