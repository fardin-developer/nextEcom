import React, { useState, useEffect } from 'react'
import '../Home/Product.css'
import './Search.css'
import { Link } from 'react-router-dom'

const Product = () => {
    let [name,setName]=useState('')
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageLength, setPageLength] = useState();
    const handlePage = (e)=>{setPage(parseInt(e.target.value))}
    let url = 'http://localhost:4000/api/v1/products?name='+name+"&page="+page+"&limit=15"
    console.log(url);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then((data) => {

                setProducts(data.data)
                setPageLength(data.length)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [url,page])

    const handleChange = (e)=>{
        setName(e.target.value)
    }

    useEffect(() => {
      console.log(url);
    });

    const renderButtons = () => {
        const buttons = [];
        for (let index = 0; index < pageLength/3; index++) {
          buttons.push(
            <button key={index} value={index + 1} onClick={handlePage}>
              {index + 1}
            </button>
          );
        }
        return buttons;
      };

    return (
        <>

        <h2> Products</h2>

            <div className='container'>
                <div className="input">
                <input type="text" name="name" id="" value={name} onChange={handleChange} />
                </div>

                {
                    products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id}>
                                <Link className="productCard">
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
            {/* <h1>{pageLength}</h1> */}
             <div className='pageNumber' style={{display:"flex",textAlign:"center"}}>{renderButtons()}</div>

        </>
    )
}

export default Product
