    import React, { useEffect, useState } from 'react';
    import axios from "axios";
    import { useNavigate } from 'react-router-dom';
    import { ArrowDown, ArrowUp, CartCheckFill } from 'react-bootstrap-icons';
    import Checkout from './Checkout';


    import "../styles/general.css";
    import "../styles/cart.css";


    function Cart() {

        const navigate = useNavigate();

        const [cart, setCart] = useState({});
        const [error, setError] = useState();
        const [visibleError, setVisibleError] = useState(false);
        const [visibleSuccess, setVisibleSuccess] = useState(false);
        const [checkedOut, setCheckedOut] = useState(false);
        const [checkedOutVisible, setCheckedOutVisible] = useState(false);


        const decrementQuantity = async (cartItem) => {
            if (cart.cart_items.find(item => item.id === cartItem.id).quantity === 1) return;
            setCart(prev => {
                return {
                    cart_items: [
                        ...prev.cart_items.map(item => {
                            if (item.id === cartItem.id) {
                                return { ...item, quantity: item.quantity - 1, total_item_price: (Number(item.total_item_price) - Number(item.price)).toFixed(2).toString() };
                            }
                            return item;
                        }),
                    ],
                    cart_total: (Number(prev.cart_total) - Number(cartItem.price)).toFixed(2).toString()
                }
            })
            try {
                await axios.put("https://hhobackend.onrender.com/api/v1/cart/updateQuantity", {
                    id: cartItem.id,
                    newQuantity: cartItem.quantity - 1
                }, { withCredentials: true });
            } catch (err) {
                setError(err.error);
            }
        };

        const incrementQuantity = async (cartItem) => {
            const stockCheck = await axios.get(`https://hhobackend.onrender.com/api/v1/products/${cartItem.id}`);
            if (stockCheck.data.stock <= cart.cart_items.find(item => item.id === cartItem.id).quantity) {
                alert("Quantity exceeds current stock");
                return;
            }

            setCart(prev => {
                return {
                    cart_items: [
                        ...prev.cart_items.map(item => {
                            if (item.id === cartItem.id) {
                                return { ...item, quantity: item.quantity + 1, total_item_price: (Number(item.total_item_price) + Number(item.price)).toFixed(2).toString() };
                            }
                            return item;
                        }),
                    ],
                    cart_total: (Number(prev.cart_total) + Number(cartItem.price)).toFixed(2).toString()
                }
            })
            try {
                await axios.put("https://hhobackend.onrender.com/api/v1/cart/updateQuantity", {
                    id: cartItem.id,
                    newQuantity: cartItem.quantity + 1
                }, { withCredentials: true });
            } catch (err) {
                setError(err.error);
            }
        };

        const removeFromCart = async (item) => {
            await axios.delete(`https://hhobackend.onrender.com/api/v1/cart/removeFromCart/${item.id}`, {
                withCredentials: true
            });
            getCartItems();

        }

        async function getCartItems() {
            try {
                const cart = await axios.get("https://hhobackend.onrender.com/api/v1/cart", { withCredentials: true });
                setCart(cart.data);
            } catch (err) {
                if (err.code == "ERR_NETWORK" || err.response.request.status == 500) {
                    setError("Internal server error.")
                } else if (err.response.request && err.response.request.status == 401) {
                    navigate('/login');
                }
            }

        }

        useEffect(() => {
            getCartItems();
        }, []);

        useEffect(() => {
            if (checkedOut) {
                setTimeout(() => {
                    setCheckedOutVisible(true);
                }, 200);
            }
        }, [checkedOut])

        useEffect(() => {
            if (error) {
                setTimeout(() => {
                    setVisibleError(true)
                }, 200)
            }
        })


        useEffect(() => {
            setTimeout(() => {
                setVisibleSuccess(true);
            }, 200);
        }, [cart]);

        return (
            <>
                {error && !Array.isArray(error) && error.length !== 0 && (
                    <div className={`cart-error fade-in3 ${visibleError ? 'visible' : ""}`}>
                        <h2>{error}</h2>
                    </div>
                )}
                {
                    !error && cart && checkedOut && (
                        <div className={`cart cart-checkout fade-in2 ${checkedOutVisible ? "visible" : ''}`}>
                            <CartCheckFill style={{ marginBottom: 15, fontSize: "2rem" }} />
                            <h2>Checkout Successful.</h2> {/* I will continue here  */}
                        </div>
                    )
                }
                {!error && cart && Object.keys(cart).length == 1 && (
                    <div className={`cart fade-in3 ${visibleSuccess ? "visible" : ""}`}>
                        <h1>Your Cart : </h1>
                        <p style={{ fontWeight: 600 }}>{cart.message}</p>
                    </div>
                )}

                {!error && cart && Object.keys(cart).length > 1 && cart.cart_items && cart.cart_items.length > 0 && !checkedOut && (
                    <div className={`cart fade-in3 ${visibleSuccess ? "visible" : ""}`}>
                        <h1>Your Cart : </h1>
                        <h3>Items: </h3>
                        <div className='cart-items'>

                            {cart.cart_items.length > 0 && cart.cart_items.map((item, index) => (
                                <div className={`cart-item`} key={index}>
                                    <img className='cart-item-img' src={item.img} alt="Image of item in cart" />
                                    <p className="cart-item-name">{index + 1}) {item.item_name}</p>
                                    <p className="cart-item-price">Price: {item.price}$</p>

                                    <div className="cart-item-quantity">
                                        <ArrowUp className='arrow' data-testid={`arrow-up-${index + 1}`} onClick={() => incrementQuantity(item)} />
                                        <p>Quantity: {item.quantity}</p>
                                        <ArrowDown className='arrow' data-testid={`arrow-down-${index + 1}`} onClick={() => decrementQuantity(item)} />
                                    </div>

                                    <p className='cart-total-item-price'>Total Price: {item.total_item_price}$</p>
                                    <p className="remove-from-cart" onClick={() => removeFromCart(item)} data-testid={`remove-from-cart-${index + 1}`}>Remove From Cart</p>
                                </div>
                            ))}
                        </div>
                        <div id="cart-total">
                            <h3>Total: </h3>
                            <p style={{ fontWeight: 600 }}>{cart.cart_total}$</p>
                        </div>
                        <div onClick={() => setCheckedOut(true)}>
                            <Checkout />
                        </div>
                    </div >
                )}

            </>
        )
    }

    export default Cart;
