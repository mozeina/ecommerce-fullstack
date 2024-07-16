import React, { useState, useEffect } from 'react';
import axios from "axios";
import { BasketFill } from "react-bootstrap-icons";
import '../styles/checkout.css';
function Checkout() {

    const [error, setError] = useState("");

    const handleCheckout = async () => {
        try {
            await axios.get("http://localhost:6543/api/v1/checkout", { withCredentials: true });
        } catch (err) {  
            setError(err.error);
        }
    };

    useEffect(() => {
        if (error) {
            alert ("Could not checkout!");
        }
    }, [error]);

    return (
        <div className="checkout">
            <p onClick={handleCheckout}>Checkout <BasketFill id="basket-fill" /> </p>
        </div>
    )
}

export default Checkout
