const express = require('express');
const db = require('../connection');
const router = express.Router();

router.get('/kategori/:kategori_id', (req, res) => {
    const { kategori_id } = req.params;

    const query = 'SELECT * FROM produk WHERE kategori_id = ?';
    db.query(query, [kategori_id], (err, results) => {
        if (err) {
            console.error('Kesalahan pada query:', err);
            return res.status(500).json({ message: 'Error retrieving products' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }

        const products = results.map(product => ({
            product_id: product.product_id,
            name: product.name,
            harga: product.harga,
            deskripsi: product.deskripsi,
            stock: product.stock,
            image_url: product.image_url
        }));

        res.status(200).json({ products });
    });
});

module.exports = router;
