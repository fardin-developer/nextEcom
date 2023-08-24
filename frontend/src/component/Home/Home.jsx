import React, { useState, useEffect } from 'react'
import { CgMouse } from "react-icons/cg";
import './Home.css'
import Product from './Product.jsx'

const Home = () => {
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

      <div className='banner'>
        <p>Welcome to E commerce</p>
        <h1>Find Amazing Products</h1>

        <a href="#container">
          <button>Scroll <CgMouse/></button>
        </a>

      </div>

      <h2 className="homeHeading">
        Featured Products
      </h2>


<div className="dashFlex">
<div className="dashed-line1"></div>
<div className="dashed-line2"></div>
<div className="dashed-line3"></div>
<div className="dashed-line4"></div>
<div className="dashed-line5"></div>
<div className="dashed-line6"></div>
<div className="dashed-line7"></div>
<div className="dashed-line8"></div>
<div className="dashed-line9"></div>
</div>


      <div className="container" id="container">
        <Product/>
      </div>

    </>
  )
}

export default Home
