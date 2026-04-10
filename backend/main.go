package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {
	InitDB()
	SeedProducts()

	r := chi.NewRouter()

	r.Get("/products", GetProducts)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", r)
}