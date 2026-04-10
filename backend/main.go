package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/cors"
	"github.com/go-chi/chi/v5"
)

func main() {
	InitDB()
	SeedProducts()

	r := chi.NewRouter()

	
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
	}))

	
	r.Get("/products", GetProducts)
	r.Post("/products", CreateProduct)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", r)
}