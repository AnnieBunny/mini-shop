import { useState, useEffect } from "react";
import * as homeService from '../../src/services/homeService'
function Home() {

    const [products, setProducts] = useState([{name:'', price:0}]);

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
  useEffect(() => {
        getProducts();

    }, [])
    function getProducts() {
        homeService.getProducts().then((data) => {
            console.log(data)
         const validProducts = data.filter((product) => product.name && product.price > 0);
        setProducts(validProducts);
           
        })
    }
  
    function addProduct() {
        homeService.addNewProduct(productName, Number(productPrice))

    }
    return (
        <>
            
                
                      
                            <h1>Products List</h1>
                            {Array.isArray(products) && products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product.id}>
                                        <span>{product.name}</span> - <span>{product.price}</span>
                                    </div>
                                ))
                            ) : (
                                <p>No valid products available</p> 
                            )}
                        
                    



            
            <input defaultValue={productName} onChange={(e) => { setProductName(e.target.value) }} name="Name" />
            <input defaultValue={productPrice} onChange={(e) => { setProductPrice(e.target.value) }} name="Price" />
            <button onClick={addProduct}>Add</button>
        </>
    )

}
export default Home;