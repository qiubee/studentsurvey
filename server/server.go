package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"studentsurvey/server/api"
	"studentsurvey/server/db"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func newRouter() *mux.Router {
	r := mux.NewRouter()
	api.Endpoints(r)
	return r
}

func main() {
	db.Connect()
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	r := newRouter()
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./dist/"))) // serve static files
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	err := http.ListenAndServe(fmt.Sprintf(":%v", port), r)
	if err != nil {
		log.Fatal(err)
	}
	db.Close()
}
