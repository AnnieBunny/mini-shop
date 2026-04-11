package main

import (
	"fmt"
	"net/http"
	"github.com/joho/godotenv"
	"github.com/go-chi/cors"
	"github.com/go-chi/chi/v5"
)

func main() {
	err := godotenv.Load()
	if err != nil {
	fmt.Println("No .env file found")
	}

	InitDB()
	SeedProducts()
	SeedUsers() 
	
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
	}))

	r.Post("/checkout", CreateCheckoutSession)
	r.With(AuthMiddleware).Get("/products", GetProducts)
	r.With(AuthMiddleware).Post("/products", CreateProduct)
	r.Post("/register", RegisterHandler)
	r.Post("/login", LoginHandler)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", r)
}