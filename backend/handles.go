package main

import (
	"encoding/json"
	"net/http"
	"os"
	"fmt"
	"io"
	"strconv"
	"github.com/stripe/stripe-go/v74/webhook"
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
	json.NewEncoder(w).Encode(products)
}

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	var p Product
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, "Invalid JSON", 400)
		return
	}

	result, err := DB.Exec("INSERT INTO products (name, price) VALUES (?, ?)", p.Name, p.Price)
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

	var req struct {
		Items []CheckoutItem `json:"items"`
	}
userID := 0
if uid := r.Context().Value("userID"); uid != nil {
    userID, _ = strconv.Atoi(uid.(string))
}
fmt.Println("Checkout userID:", userID)
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", 400)
		return
	}

	var lineItems []*stripe.CheckoutSessionLineItemParams
	total := 0

	for _, item := range req.Items {
		qty := item.Quantity
		if qty < 1 {
			qty = 1
		}
		total += item.Price * qty

		lineItems = append(lineItems, &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency: stripe.String("usd"),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name: stripe.String(item.Name),
				},
				UnitAmount: stripe.Int64(int64(item.Price * 100)),
			},
			Quantity: stripe.Int64(int64(qty)),
		})
	}

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
		LineItems: lineItems,
		SuccessURL: stripe.String("http://localhost:3000/success"),
		CancelURL: stripe.String("http://localhost:3000/cancel"),
	}
	params.AddMetadata("user_id", fmt.Sprintf("%d", userID))
	params.AddMetadata("total", fmt.Sprintf("%d", total))
	params.PaymentIntentData = &stripe.CheckoutSessionPaymentIntentDataParams{
		Metadata: map[string]string{
			"source": "mini-shop",
		},
	}

	s, err := session.New(params)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"url": s.URL})
}






func HandleWebhook(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Cannot read body", http.StatusBadRequest)
		return
	}

	event, err := webhook.ConstructEventWithOptions(
		body,
		r.Header.Get("Stripe-Signature"),
		os.Getenv("STRIPE_WEBHOOK_SECRET"),
		webhook.ConstructEventOptions{
			IgnoreAPIVersionMismatch: true,
		},
	)
	if err != nil {
		fmt.Println("Invalid signature or event:", err)
		http.Error(w, "Invalid signature", http.StatusBadRequest)
		return
	}
	fmt.Println("EVENT-TYPE",event.Type)



	switch event.Type {
	case "checkout.session.completed":
		var session stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
			http.Error(w, "Failed to parse event", http.StatusBadRequest)
			return
		}

		total := 0
		if totalStr, ok := session.Metadata["total"]; ok {
			total, _ = strconv.Atoi(totalStr)
		}
		userID := 0
		if userStr, ok := session.Metadata["user_id"]; ok {
			userID, _ = strconv.Atoi(userStr)
		}

		paymentIntentID := ""
		if session.PaymentIntent != nil {
			paymentIntentID = session.PaymentIntent.ID
		}
		_, err := DB.Exec(`
			INSERT INTO orders (user_id, amount, status, stripe_payment_intent_id)
			VALUES (?, ?, ?, ?)`,
			userID,
			total,
			"paid",
			paymentIntentID,
		)
		if err != nil {
			fmt.Println("DB error:", err)
		} else {
			fmt.Println("Order saved successfully!")
		}

	default:
	
		fmt.Println("Unhandled event type:", event.Type)
	}

	w.WriteHeader(http.StatusOK)
}

func GetUserOrders(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.Context().Value("userID")
    if userIDStr == nil {
        http.Error(w, "User not authenticated", http.StatusUnauthorized)
        return
    }

    userID, err := strconv.Atoi(userIDStr.(string))
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }

    
    rows, err := DB.Query("SELECT id, amount, status, stripe_payment_intent_id FROM orders WHERE user_id = ?", userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    type Order struct {
        ID                  int    `json:"id"`
        Amount              int    `json:"amount"`
        Status              string `json:"status"`
        StripePaymentIntent string `json:"stripe_payment_intent_id"`
    }

    var orders []Order
    for rows.Next() {
        var o Order
        if err := rows.Scan(&o.ID, &o.Amount, &o.Status, &o.StripePaymentIntent); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        orders = append(orders, o)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(orders)

fmt.Println(" orders for user:", orders)

}