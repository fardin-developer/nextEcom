import React, { useState, useEffect } from 'react'
import './Product.css'
import { Link } from 'react-router-dom'

const Product = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/api/v1/products')
            .then(res => res.json())
            .then((data) => {

                setProducts(data.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    return (
        <>

            <h2> Products</h2>

            <div className='container'>

                {
                    products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id}>
{                                console.log(product)
}                                <Link className="productCard">
                                    <img src="https://picsum.photos/seed/picsum/100/120" alt="Img" />
                                    <h2>{product.name}</h2>
                                    <div>
                                        <p>20 ratings</p>
                                        <span className='productCardSpan'>
                                            210 Reviews
                                        </span>
                                    </div>
                                    <span>₹ 250</span>
                                </Link>

                            </div>))
                    ) : (
                        <p>Loading products...</p>
                    )
                }

            </div>
        </>
    )
}

export default Product
