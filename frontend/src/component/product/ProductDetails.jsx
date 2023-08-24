import React from 'react'
import './ProductDetails.css'
import LongButton from '../LongButton'

const ProductDetails = () => {
  return (
    <>

      <div className="main">
        <div className="left">
          <div className="bigImg">
            <img src="https://picsum.photos/id/237/300/300" alt="" />
          </div>
          <div className="section2">
            <div className="smallImgBox">
              <img src="https://picsum.photos/seed/picsum/300/200" alt="" />
            </div>
            <div className="smallImgBox">
              <img src="https://picsum.photos/seed/picsum/300/200" alt="" />
            </div>
            <div className="smallImgBox">
              <img src="https://picsum.photos/seed/picsum/300/200" alt="" />
            </div>
            <div className="smallImgBox">
              <img src="https://picsum.photos/seed/picsum/300/200" alt="" />
            </div>
           
          </div>

        </div>
        <div className="right">
          <div className="title">
            <h1>New Product</h1>
            <h3>$359</h3>
            <h3>ratings</h3>
            <div className="par">
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam, iste esse consequuntur autem fugit voluptatibus deserunt ad? Voluptatibus sequi, sapiente quod porro eaque sunt eum corrupti placeat eos ea commodi?
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam, iste esse consequuntur autem fugit voluptatibus deserunt ad? Voluptatibus sequi, sapiente quod porro eaque sunt eum corrupti placeat eos ea commodi?
              </p>
            </div>

          </div>

          {/* <div className="button">
            <a href="#" class="rectangle-button">Add to Cart</a>
            </div> */}
          <div className="lungBtn">
            <LongButton />

          </div>
        </div>
      </div>

    </>

  )
}

export default ProductDetails
