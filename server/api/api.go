package api

import (
	"fmt"
	"log"
	"net/http"
)

func HandleQuestions(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(r.ParseForm())
}
