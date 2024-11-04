const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../connection');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(query, [username, email, passwordHash, 1], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error creating user account' });
            }

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: result.insertId,
                    username,
                    email,
                    role: 1
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user account' });
    }
});

module.exports = router;
