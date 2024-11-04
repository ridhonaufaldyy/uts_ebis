const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../connection');
const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM user WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving user' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        let redirectUrl;
        if (user.role === 1) {
            redirectUrl = 'http://yourwebsite.com/user-dashboard';
        } else if (user.role === 0) {
            redirectUrl = 'http://yourwebsite.com/admin-dashboard';
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                redirectUrl
            }
        });
    });
});

module.exports = router;
