

// export function createCheckoutSession() {
    
//     return fetch("http://localhost:8080/checkout", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         // body: JSON.stringify(product)
//     })
//      .then(res => {
//         if (!res.ok) {
//             throw new Error('Failed to insert product');
//         }
//         return res.json();
//     })
//     .then(data => {
//          return data;
//     })
//     .catch(err => {
//         console.error("Error:", err);
//     });
//         // .then(res => res.json())
//         // .catch(err => console.log(err))
// }

// export function createCheckoutSession() {
//   return  fetch("http://localhost:8080/checkout", {
//     method: "POST",
//   }).then(data => {
//       window.location.href = data.url;
//     })

// };

export const createCheckoutSession = async (cart,token) => {
  const res = await fetch("http://localhost:8080/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token 
    },
    body: JSON.stringify({ items: cart })
  });

  const data = await res.json();
  window.location.href = data.url;
};

export const getUserOrders = async (token) => {
  const res = await fetch("http://localhost:8080/orders", {
    headers: {
      "Authorization": token,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};