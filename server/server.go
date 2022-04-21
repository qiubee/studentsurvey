package main

import (
	"log"
	"net/http"
	"studentsurvey/server/api"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./dist"))) // serve static files
	http.HandleFunc("/v1/", api.Endpoints)
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
