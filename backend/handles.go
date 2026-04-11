package main

import (
	"encoding/json"
	"net/http"

	"os"
	"fmt"

	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/checkout/session"
)

func GetProducts(w http.ResponseWriter, r *http.Request) {

    rows, err := DB.Query("SELECT id, name, price FROM products")
    if err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    defer rows.Close()

    var products []Product

    
    for rows.Next() {
        var p Product
        if err := rows.Scan(&p.ID, &p.Name, &p.Price); err != nil {
            http.Error(w, err.Error(), 500) 
            return
        }
        products = append(products, p)
    }

    if err := rows.Err(); err != nil {
        http.Error(w, err.Error(), 500)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK) // 200 OK
    json.NewEncoder(w).Encode(products)
}

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	var p Product

	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, "Invalid JSON", 400)
		return
	}

	result, err := DB.Exec(
		"INSERT INTO products (name, price) VALUES (?, ?)",
		p.Name,
		p.Price,
	)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	id, _ := result.LastInsertId()
	p.ID = int(id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func CreateCheckoutSession(w http.ResponseWriter, r *http.Request) {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	w.Header().Set("Content-Type", "application/json")

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		Mode:               stripe.String(string(stripe.CheckoutSessionModePayment)),

		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String(string(stripe.CurrencyUSD)),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String("Test Product"),
					},
					UnitAmount: stripe.Int64(2000), 
				},
				Quantity: stripe.Int64(1),
			},
		},

		SuccessURL: stripe.String("http://localhost:3000/success"),
		CancelURL:  stripe.String("http://localhost:3000/cancel"),
	}

	s, err := session.New(params)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"url": s.URL,
	})
	fmt.Println("Stripe key:", os.Getenv("STRIPE_SECRET_KEY"))
}