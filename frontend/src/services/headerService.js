const API_URL = process.env.GO_APP_API_URL;

export const createCheckoutSession = async (cart,token) => {
  const res = await fetch(`${API_URL}/checkout`, {
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
  const res = await fetch(`${API_URL}/orders`, {
    headers: {
      "Authorization": token,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};