const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../connection'); // Koneksi database

const router = express.Router();

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Tempat penyimpanan file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Menambahkan nama unik pada file
    }
});

// Inisialisasi multer
const upload = multer({ storage: storage });

// Endpoint untuk menambahkan produk baru dengan gambar
router.post('/add_produk', upload.single('image'), (req, res) => {
    const { name, kategori_id, harga, deskripsi, stock } = req.body;
    const image_url = req.file ? req.file.path : null; // Mendapatkan path dari gambar yang di-upload

    console.log('Received data:', { name, kategori_id, harga, deskripsi, stock, image_url }); // Log data

    // Validasi input
    if (!name || !kategori_id || !harga || !deskripsi || !stock || !image_url) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Query untuk menambahkan produk ke database
    const query = 'INSERT INTO produk (name, kategori_id, harga, deskripsi, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, kategori_id, harga, deskripsi, stock, image_url], (err, result) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ message: 'Error creating product' });
        }

        res.status(201).json({
            message: 'Product created successfully',
            product: {
                product_id: result.insertId,
                name,
                kategori_id,
                harga,
                deskripsi,
                stock,
                image_url
            }
        });
    });
});

module.exports = router;
