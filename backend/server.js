const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const userRoutes = require('./src/store/routers/userRoutes');
const productsRoutes = require('./src/store/routers/productsRoutes');
const cartRoutes = require('./src/store/routers/cartRoutes');
const accountRoutes = require('./src/store/routers/accountRoutes');
const ordersRoutes = require('./src/store/routers/ordersRoutes');
const checkoutRoutes = require('./src/store/routers/checkoutRoutes');
const authRoutes = require('./src/store/routers/authRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//do we even need the db here
// const pool = require('./config/db');


const app = express();

const PORT = process.env.PORT || 6543;


app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ credentials: true, origin: 'https://harrys-hair-oils.onrender.com' }));
app.use(cookieParser());


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/checkAuth', authRoutes);


app.get('/', (req, res) => {
    res.send('hello, world!');
})


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});
