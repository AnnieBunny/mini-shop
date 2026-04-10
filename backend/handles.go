package main

import (
	"encoding/json"
	"net/http"
)

func GetProducts(w http.ResponseWriter, r *http.Request) {
	rows, _ := DB.Query("SELECT id, name, price FROM products")

	var products []map[string]interface{}

	for rows.Next() {
		var id int
		var name string
		var price int

		rows.Scan(&id, &name, &price)

		products = append(products, map[string]interface{}{
			"id":    id,
			"name":  name,
			"price": price,
		})
	}

	json.NewEncoder(w).Encode(products)
}