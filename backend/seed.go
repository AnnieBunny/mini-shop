package main

import "log"

func SeedProducts() {
	query := `
	INSERT INTO products (name, price)
	SELECT 'Laptop', 2000
	WHERE NOT EXISTS (SELECT 1 FROM products);
	`

	_, err := DB.Exec(query)
	if err != nil {
		log.Println(err)
	}
}

func SeedUsers() {
	query := `
	INSERT OR IGNORE INTO users (email, password)
	VALUES ('test@test.com', '1234');
	`

	_, err := DB.Exec(query)
	if err != nil {
		log.Println("Error seeding users:", err)
	}
}