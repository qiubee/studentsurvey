package main

import (
	"log"
	"net/http"
	"studentsurvey/server/api"

	"github.com/gorilla/mux"
)

func newRouter() *mux.Router {
	r := mux.NewRouter()
	api.Endpoints(r)
	return r
}

func main() {
	r := newRouter()
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./dist/"))) // serve static files
	err := http.ListenAndServe(":8000", r)
	if err != nil {
		log.Fatal(err)
	}
}
