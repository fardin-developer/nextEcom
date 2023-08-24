import { useState, useEffect } from "react";
import Header from "./component/layout/Header/Header.jsx"
import {BrowserRouter as Router,Routes, Route} from "react-router-dom";
import WebFont from "webfontloader"
import Home from "./component/Home/Home.jsx";
import Footer from "./component/layout/Footer/Footer.jsx";
import './App.css'
import Products from './component/Products/Products.jsx'
import Search from './component/Search/Search.jsx'
import Product from "./component/product/ProductDetails.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  useEffect(()=>{
    WebFont.load({
      google: {
        families: ['Roboto','Droid Sans', 'Droid Serif']
      }
    });
  }, [])

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

    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/Search" element={<Search/>}/>
      </Routes>
      <Footer/>
    </Router>

  )
}

export default App
