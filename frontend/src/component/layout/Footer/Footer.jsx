import React from 'react'
const playstore ='https://upload.wikimedia.org/wikipedia/commons/7/7a/Google_Play_2022_logo.svg'
const Appstore ='https://upload.wikimedia.org/wikipedia/commons/7/7a/Google_Play_2022_logo.svg'

import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playstore} alt="playstore" />
        <img src={Appstore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
        <p>Help Others and stay happy</p>

        <p>Copyrights 2023 &copy; Fardin Ecom</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="/">Instagram</a>
        <a href="/">Youtube</a>
        <a href="/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;