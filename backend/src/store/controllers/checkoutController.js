const pool = require('../../../config/db');


const checkout = async (req, res) => {
    const { userId } = req;
    try {

        let usersCart = await pool.query('SELECT * from cart_items ci join carts c on c.id = ci.cart_id join users u on u.id = c.user_id where u.id = $1', [userId])

        if (usersCart.rows.length === 0) return res.status(404).json({ "error": "cart is empty!" });

        for (let row of usersCart.rows) {

            let quantityToRemoveFromStock = row.quantity;
            let idOfQuantityToRemoveFromStock = row.item_id;

            await pool.query('update items set stock = stock - $1 where id = $2', [quantityToRemoveFromStock, idOfQuantityToRemoveFromStock]);
        }


        await pool.query('delete from cart_items using carts where cart_items.cart_id = carts.id and carts.user_id = $1', [userId]);

        return res.status(200).json({ "Checkout successful": "please enjoy your items! :3" });

    } catch (err){
        console.error(err);
        return res.status(500).json({"error": "internal server error"});

    }   

    

};

module.exports = { checkout }