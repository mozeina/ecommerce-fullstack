const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const userRoutes = require('./src/store/routers/userRoutes');
const productsRoutes = require('./src/store/routers/productsRoutes');
const cartRoutes = require('./src/store/routers/cartRoutes');
const accountRoutes = require('./src/store/routers/accountRoutes');
const ordersRoutes = require('./src/store/routers/ordersRoutes');
const checkoutRoutes = require('./src/store/routers/checkoutRoutes');
const cors = require('cors');

//do we even need the db here
// const pool = require('./config/db');


const app = express();

const PORT = process.env.PORT || 6543;


app.use(bodyParser.json());
app.use(express.json());
app.use(cors());    

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/checkout', checkoutRoutes);


app.get('/', (req, res) => {
    res.send('hello, world!');
})


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});
