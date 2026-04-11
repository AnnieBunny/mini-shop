package main

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite", "./database.db")
	if err != nil {
		log.Fatal(err)
	}

	
	createProducts := `
	CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		price INTEGER
	);`
	_, err = DB.Exec(createProducts)
	if err != nil {
		log.Fatal(err)
	}

	
	createUsers := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE,
		password TEXT
	);`
	_, err = DB.Exec(createUsers)
	if err != nil {
		log.Fatal(err)
	}

	
	createOrders := `
	CREATE TABLE IF NOT EXISTS orders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		amount INTEGER,
		status TEXT,
		stripe_payment_intent_id TEXT,
		FOREIGN KEY(user_id) REFERENCES users(id)
	);`
	_, err = DB.Exec(createOrders)
	if err != nil {
		log.Fatal(err)
	}
}