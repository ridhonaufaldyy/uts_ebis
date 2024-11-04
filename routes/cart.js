const express = require('express');
const db = require('../connection');
const router = express.Router();

// Endpoint untuk menambahkan produk ke keranjang
app.post('/add_to_cart', (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    // Validasi input
    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ message: 'User ID, Product ID, and quantity are required' });
    }

    // Cek apakah produk sudah ada di keranjang
    const checkQuery = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
    db.query(checkQuery, [user_id, product_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error checking cart' });
        }

        if (results.length > 0) {
            // Jika produk sudah ada, perbarui kuantitas
            const newQuantity = results[0].quantity + quantity;
            const updateQuery = 'UPDATE cart SET quantity = ? WHERE cart_id = ?';
            db.query(updateQuery, [newQuantity, results[0].cart_id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error updating cart' });
                }
                return res.status(200).json({ message: 'Product quantity updated in cart' });
            });
        } else {
            // Jika produk belum ada, tambahkan ke keranjang
            const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
            db.query(insertQuery, [user_id, product_id, quantity], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error adding product to cart' });
                }
                return res.status(201).json({ message: 'Product added to cart' });
            });
        }
    });
});

module.exports = router;
