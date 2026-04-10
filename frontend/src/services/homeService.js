
export function getProducts() {
  return fetch("http://localhost:8080/products")
    .then(res => res.json())  
    .then(data => {
      console.log(data); 
      return data;  
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      return [];  
    });
}

export function addNewProduct(name, price) {
    let product = {
     name,
     price
    }
    return fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    })
     .then(res => {
        if (!res.ok) {
            throw new Error('Failed to insert product');
        }
        return res.json();
    })
    .then(data => {
        console.log("Product added successfully:", data);
    })
    .catch(err => {
        console.error("Error:", err);
    });
        // .then(res => res.json())
        // .catch(err => console.log(err))
}