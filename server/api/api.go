package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func saveAnswers(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(r.ParseForm())
}

func Endpoints(r *mux.Router) {
	api := r.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/answers", saveAnswers).Methods(http.MethodPost, http.MethodOptions)
	api.Use(mux.CORSMethodMiddleware(r))
}
