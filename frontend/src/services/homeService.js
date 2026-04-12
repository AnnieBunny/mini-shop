const API_URL = process.env.REACT_APP_API_URL;

export const getProducts = (token) => {
  return fetch(`${API_URL}/products`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    return res.json();
  });
};

export function addNewProduct(name, price,token) {
    let product = {
     name,
     price
    }
    return fetch(`${API_URL}/products`, {
        method: "POST",
        
        headers: {
            "Authorization": token,
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