package main

import (
	"log"
	"net/http"
	"studentsurvey/server/api"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./dist/"))) // serve static files
	r.HandleFunc("/api/v1/{endpoint}", api.Endpoints)
	err := http.ListenAndServe(":8000", r)
	if err != nil {
		log.Fatal(err)
	}
}
