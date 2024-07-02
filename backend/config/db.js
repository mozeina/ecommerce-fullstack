const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ecommerce",
    password: process.env.DATABASE_PASSWORD,
    port: 5432
});

module.exports = pool;