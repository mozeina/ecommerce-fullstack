const pool = require('../../../config/db');

const viewCart = (req, res) => {
    // throw new Error('lol');
    let userId = req.userId;
    pool.query(`SELECT i.id, i.item_name, i.price, ci.quantity, (i.price * ci.quantity) as total_item_price, i.img
    FROM items i
    JOIN cart_items ci ON ci.item_id = id
    JOIN carts c ON c.id = ci.cart_id
    JOIN users u ON u.id = c.user_id
    WHERE u.id = $1 `, [userId], (err, result) => {

        if (err) {
            console.error(err)
            return res.status(500).send({ "error": "server error" })
        } else if (result && result.rows.length == 0) {
            res.status(200).json({ "message": "Your cart is empty..." })
        } else {

            let total_price = 0;

            result.rows.forEach(row => {
                total_price += parseFloat(row.total_item_price);
            })

            res.status(200).json({
                "cart_items": result.rows,
                "cart_total": total_price.toFixed(2)
            });
        }
    })

}

const addToCart = async (req, res) => {
    //the body will include the id and quantity
    const { userId } = req;
    const { id, quantity } = req.body
    try {
        if (!id || !quantity || isNaN(quantity)) {
            return res.status(400).json({ "error": "please provide item ID and desired quantity" })
        }

        let idOfItem = await pool.query('SELECT * from items where id = $1', [id]);

        if (idOfItem.rows.length === 0) {

            return res.status(400).json({ "error": "no item exists at specified ID" })
        }

        let stockOfId = await pool.query('SELECT stock FROM items WHERE id = $1', [id]);


        if (quantity > stockOfId.rows[0].stock) {
            return res.status(400).json({ "error": "Provided quantity exceeds current stock" });
        }


        let usersCart = await pool.query('select c.id from users u join carts c on c.user_id = u.id where u.id = $1', [userId])

        if (usersCart.rows.length === 0) {
            return res.status(400).json({ "error": "Database error, please conatact support" });
        }

        let usersCartId = usersCart.rows[0].id;

        let isItemInCart = await pool.query('select * from cart_items where item_id = $1 and cart_id = $2', [id, usersCartId]);

        if (isItemInCart.rows.length === 0) {
            await pool.query('INSERT INTO cart_items (cart_id, item_id, quantity) VALUES ($1, $2, $3)', [usersCartId, id, quantity]);
        } else {
            let existingQuantity = await pool.query('select quantity from cart_items where item_id = $1 and cart_id = $2', [id, usersCartId]);

            let wholeQuantity = Number(existingQuantity.rows[0].quantity) + Number(quantity);


            if (wholeQuantity > stockOfId.rows[0].stock) {
                return res.status(400).json({ "error": "Quantity here and in cart exceed current stock" });
            }

            await pool.query('UPDATE cart_items set quantity = $1 where cart_id = $2 and item_id = $3', [wholeQuantity, usersCartId, id]);
        }



        return res.status(201).json({ "message": "item successfully added to cart" });


    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ "error": "Internal server error" })
    }


}

const removeFromCart = async (req, res) => {

    const { userId } = req;

    const { id } = req.params;

    try {
        if (!id || !Number(id)) {
            return res.status(400).json({ "error": "please enter item's correct ID" });
        }
        let cartId = await pool.query("select c.id from carts c join users u on u.id = c.user_id where u.id = $1", [userId])

        let itemInCart = await pool.query('SELECT * from cart_items ci join carts c on c.id = ci.cart_id join users u on u.id = c.user_id where u.id = $1 and ci.item_id = $2 ', [userId, id]);

        if (itemInCart.rows.length === 0) return res.status(404).json({ "error": "item doesn't exist in cart" });


        await pool.query('DELETE FROM cart_items WHERE cart_id = $1 AND item_id = $2', [cartId.rows[0].id, id]);

        res.status(202).json({ "message": "item removed from cart successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ "error": "internal server error" });
    }
}

const updateQuantity = async (req, res) => {
    const { id, newQuantity } = req.body;
    let { userId } = req;

    try {
        if (!id || !Number(id) || !newQuantity || !Number(newQuantity) || newQuantity <= 0) {
            return res.status(400).json({ "error": "please enter valid ID / newQuantity" })
        }

        let itemExists = await pool.query('select * from items where id = $1', [id]);
        if (itemExists.rows.length === 0) return res.status(404).json({ "error": "item doesn't exist in store" });

        let itemInCart = await pool.query('select * from items i join cart_items ci on ci.item_id = i.id join carts c on c.id = ci.cart_id join users u on c.user_id = u.id where u.id = $1 and i.id = $2', [userId, id])

        if (itemInCart.rows.length === 0) {
            return res.status(404).json({ "error": "item doesn't exist in cart" })
        }

        let stockOfId = await pool.query('select stock from items where id = $1', [id])

        if (stockOfId && stockOfId.rows && newQuantity > stockOfId.rows[0].stock) {
            return res.status(400).json({ "error": "provided quantity exceeds current stock" });
        }

        await pool.query(`
            UPDATE cart_items
            SET quantity = $3
            FROM carts, users
            WHERE carts.id = cart_items.cart_id
            AND users.id = carts.user_id
            AND users.id = $1
            AND cart_items.item_id = $2
        `, [userId, id, newQuantity]);


        return res.status(200).json({ "message": "quantity updated sucessfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ "error": "internal server error" })
    }
}
module.exports = { viewCart, addToCart, removeFromCart, updateQuantity };

