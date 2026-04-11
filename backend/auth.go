package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("supersecretkey")

type User struct {
	ID       int
	Email    string `json:"email"`
	Password string `json:"password"`
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		claims := &jwt.RegisteredClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "userID", claims.Subject)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var u User
	json.NewDecoder(r.Body).Decode(&u)

	if u.Email == "" || u.Password == "" {
		http.Error(w, "Email and password required", http.StatusBadRequest)
		return
	}
	_, err := DB.Exec("INSERT INTO users (email, password) VALUES (?, ?)", u.Email, u.Password)
	if err != nil {
		http.Error(w, "User already exists", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("User registered"))
}


func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var u User
	json.NewDecoder(r.Body).Decode(&u)

	row := DB.QueryRow("SELECT id, email, password FROM users WHERE email=?", u.Email)
var user User
err := row.Scan(&user.ID, &user.Email, &user.Password)
	if err != nil || user.Password != u.Password {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	claims := jwt.RegisteredClaims{
		Subject:   fmt.Sprintf("%d", user.ID),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString(jwtSecret)

	json.NewEncoder(w).Encode(map[string]string{"token": tokenStr, "email": user.Email})
}