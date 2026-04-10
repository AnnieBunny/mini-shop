package main

import (
	"database/sql"
	_ "modernc.org/sqlite"
	"log"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite", "./database.db")
	if err != nil {
		log.Fatal(err)
	}

	createTable := `
	CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		price INTEGER
	);
	`

	_, err = DB.Exec(createTable)
	if err != nil {
		log.Fatal(err)
	}
}