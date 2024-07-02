import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExclamationTriangle } from 'react-bootstrap-icons';


import '../styles/general.css';
import '../styles/products.css';
import '../styles/loading.css';


function Products() {
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [visible1, setvisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {

      try {
        const ourData = await axios.get('http://localhost:6543/api/v1/products');
        setProducts(ourData.data);

      } catch (err) {
        console.error(err);
        setError(true);
      }

    }

    fetchData();

    setIsLoading(false);


  }, [])

  useEffect(() => {
    setTimeout(() => {
      setvisible1(true)
    }, 100)
  }, []);

  useEffect(() => {
    if (visible1)  {
      setVisible2(true)
    }
  }, [visible1]);

  useEffect(() => {
    setTimeout(() => {
      if (visible2) {
        setVisible3(true);
      }
    }, 500)
  }, [visible2])






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
          {products.map(product => {
            return (
              <div className='product' key={product.id}>
                <img className={`product-image fade-in2 ${visible2 ? 'visible' : ''}`} src={`${product.img}`} alt={`Image of our ${product.item_name}`} />
                <h3 className={`product-name fade-in3 ${visible3 ? 'visible' : ''}`}>{product.item_name}</h3>
                <p className={`product-description fade-in3 ${visible3 ? 'visible' : ''}`}>{product.description}</p>
                <p className={`product-price fade-in3 ${visible3 ? 'visible' : ''}`}>{product.price}$ /250ml Container</p>
                <p className={`product-stock fade-in3 ${visible3 ? 'visible' : ''}`}>Left in stock: {product.stock}</p>
              </div>
            )
          })}

        </div>
      )}
      {/* IF ERROR OCCURED WITH FETCHING POSTS */}
      {error && (
        <div className={`products-page poiret-one fade-in3 ${visible1 ? 'visible1' : ''}`}>
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
