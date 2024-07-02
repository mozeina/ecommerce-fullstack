const pool = require('../../../config/db');


const viewProducts = (req, res) => {
    pool.query("SELECT * FROM items;", (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).json({ "error": "Server error" });
        } else {
            res.status(200).json(result.rows)
        }
    })
};

const viewSpecificProduct = (req, res) => {
    const { id } = req.params;
    pool.query('select * from items where id = $1', [id], (err, result) => {
        if (err) {
            console.error('Error executing query')
            res.status(500).json({ "error": "Server error" })
        } else {
            if (result.rows.length < 1) {
                res.status(404).json({ "error": "There is no product at specified id" })
            } else {
                res.status(200).json(result.rows[0]);
            }
        }
    });
};

const addProductToCart = (req, res) => {
    
};


module.exports = { viewProducts, viewSpecificProduct }