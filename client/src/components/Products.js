import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangle, PlusCircle, BagCheck } from 'react-bootstrap-icons';
import { HeaderContext } from '../App';


import '../styles/general.css';
import '../styles/products.css';
import '../styles/loading.css';


function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false)
  const [visible1, setvisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);

  const { setHeaderUpdate } = useContext(HeaderContext);


  const fetchData = async () => {

    try {
      const ourData = await axios.get('http://localhost:6543/api/v1/products');
      setProducts(ourData.data);
      setHeaderUpdate(prev => !prev);
      setIsLoading(false);
    } catch (err) {
      setError(true);
      setHeaderUpdate(prev => !prev);

    }

  }

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [])




  useEffect(() => {
    setTimeout(() => {
      setvisible1(true)
    }, 100)
  }, []);

  useEffect(() => {
    if (visible1 && products) {
      setIsLoading(false);
      setTimeout(() => {
        setVisible2(true);
      }, 200)
    }
  }, [visible1]);

  useEffect(() => {
    if (visible2) {
      setTimeout(() => {
        setVisible3(true);
      }, 500)
    }

  }, [visible2])



  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setTimeout(() => {
        setVisible3(true);
      }, 200);
    }
  }, [error]);


  const addToCart = async (item) => {

    let quantity = products.find(product => product.id === item.id).quantity;
    if (!quantity) {
      quantity = 1;
    }
    if (quantity < 1) {
      setAddedSuccessfully(false);
      return;
    }


    try {
      await axios.post("http://localhost:6543/api/v1/cart/addToCart", {
        id: item.id,
        quantity: quantity
      }, { withCredentials: true });
      removeQuantityErrors(item);


    } catch (err) {
      if (err.response.status === 401) {
        navigate("/login");
      } else if (err.response.status === 400) {
        quantityErrorSetter(item);
      }
    }

  }

  const changeQuantity = (e, productId) => {
    setProducts(prev => {
      return [
        ...prev.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              quantity: e.target.value
            }
          }
          return product;
        })
      ]
    })
  }

  const quantityErrorSetter = async (item) => {
    let usersCart = await axios.get("http://localhost:6543/api/v1/cart", { withCredentials: true });

    setProducts(prev => {
      return [
        ...prev.map(product => {
          if (product.id === item.id) {
            return {
              ...product,
              quantityError: usersCart && usersCart.data.cart_items && usersCart.data.cart_items.find(product => product.id === item.id) ? "Quantity here and in cart exceed current stock" : "Quantity exceeds current stock",
              addedSuccessfully: null
            }
          }
          return {
            ...product,
            quantityError: null,
            addedSuccessfully: null
          }
        })
      ]
    })
    setQuantityError(true);
    setAddedSuccessfully(false);
  }

  const removeQuantityErrors = (item) => {
    setProducts(prev => {
      return [
        ...prev.map(product => {
          if (product.id === item.id) {
            return {
              ...product,
              addedSuccessfully: "Added to cart successfully",
              quantityError: null
            }
          }
          return {
            ...product,
            quantityError: null
          }
        })
      ]
    })
    setQuantityError(false);
    setAddedSuccessfully(true);
  };

  useEffect(() => {
    if (quantityError) {
      setTimeout(() => {
        setVisible4(true);
      }, 200)
    } else if (!quantityError) {
      setVisible4(false);
    }
  }, [quantityError])
  //products is an array with the objects as values... the properties are id, item_name, description, price, stock

  return (
    <>
      {/* IF PRODUCTS ARE LOADING  */}
      {isLoading && (
        <div className='products-page poiret-one'>
          <div id="load">
            <div>G</div>
            <div>N</div>
            <div>I</div>
            <div>D</div>
            <div>A</div>
            <div>O</div>
            <div>L</div>
          </div>
        </div>
      )}
      {/* IF PRODUCTS ARE FETCHED */}
      {!isLoading && !error && products && products.length > 0 && (
        <div className='products-page poiret-one'>
          {products.map((product, index) => {
            return (
              <div className='product' key={product.id}>
                <img className={`product-image fade-in2 ${visible2 ? 'visible' : ''}`} src={`${product.img}`} alt={`Image of our ${product.item_name}`} />
                <h3 className={`product-name fade-in3 ${visible3 ? 'visible' : ''}`}>{product.item_name}</h3>
                <p className={`product-description fade-in3 ${visible3 ? 'visible' : ''}`}>{product.description}</p>
                <p className={`product-price fade-in3 ${visible3 ? 'visible' : ''}`}>{product.price}$ /250ml Container</p>
                <p className={`product-stock fade-in3 ${visible3 ? 'visible' : ''}`}>Left in stock: {product.stock}</p>
                <div className={`add-to-cart fade-in3 ${visible3 ? "visible" : ""}`}>
                  <PlusCircle id="plus-circle" onClick={() => addToCart(product)} data-testid={`add-to-cart-${index + 1}`} />
                  <p>{!product.quantityError && addedSuccessfully && product.addedSuccessfully ? (
                    <>
                      {product.addedSuccessfully} <BagCheck />
                    </>
                  ) : "Add To Cart"}</p>
                  <input type='number' id='quantity' name="quantity" defaultValue={1} min={1} max={product.stock} onChange={(e) => changeQuantity(e, product.id)} />
                </div>
                {product.quantityError && (
                  <p className={`product-quantity-error fade-in3 ${visible4 ? "visible" : ""}`}>{product.quantityError}</p>
                )}
              </div>
            )
          })}

        </div>
      )}
      {/* IF ERROR OCCURED WITH FETCHING POSTS */}
      {error && (
        <div className={`products-page poiret-one fade-in3 ${visible3 ? 'visible' : ''}`}>
          <div className='products-error'>
            <ExclamationTriangle id="exclamation-triangle" />
            <p>There's been an error with fetching products...</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Products
