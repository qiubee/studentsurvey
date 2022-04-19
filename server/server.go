package main

import (
	"log"
	"net/http"
	"studentsurvey/server/api"
)

func main() {
	http.HandleFunc("/v1/questions", api.HandleQuestions)
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
