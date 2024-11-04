const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    port: 8080,
    user: "root",
    password: "",
    database: "e_commerce"
})


module.exports = db