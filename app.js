const express = require('express');
const bodyParser = require('body-parser');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const getProdukByKategoriRoute = require('./routes/get_produk_by_kategori.js');
const postProdukRoute = require('./routes/post_produk.js');
const getAllProdukRoute = require('./routes/get_all_produk.js');

// const cors = require('cors');

const app = express();

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
// app.use(cors()); 

// Gunakan route terpisah untuk setiap endpoint
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/get_produk_by_kategori', getProdukByKategoriRoute);
app.use('/post_produk', postProdukRoute);
app.use('/get_all_produk', getAllProdukRoute);


// Menjalankan server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
