package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"studentsurvey/server/db"
	"studentsurvey/server/db/models"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
)

func saveAnswers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if len(r.Form) < 21 || r.FormValue("leeftijd") == "" {
		w.WriteHeader(http.StatusBadRequest)
		resp := make(map[string]string)
		resp["message"] = "Data is not complete."
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Fatalf("Error in JSON marshal: %s", err)
		}
		w.Write(jsonResp)
		return
	}

	var answers models.Answers
	answers.TimeOfSubmission = time.Now().UTC()
	decoder := schema.NewDecoder()
	err = decoder.Decode(&answers, r.PostForm)
	if err != nil {
		fmt.Printf("error: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		resp := make(map[string]string)
		resp["message"] = "Data malformed."
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Fatalf("Error in JSON marshal: %s", err)
		}
		w.Write(jsonResp)
		return
	}

	coll := db.Database().Collection("answers")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err = coll.InsertOne(ctx, answers)
	if err != nil {
		fmt.Printf("error: %v", err)
		w.WriteHeader(http.StatusBadGateway)
		resp := make(map[string]string)
		resp["message"] = "Could not save data."
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Fatalf("Error in JSON marshal: %s", err)
		}
		w.Write(jsonResp)
		return
	}

	w.WriteHeader(http.StatusCreated)
	resp := make(map[string]string)
	resp["message"] = "Data saved."
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("Error in JSON marshal: %s", err)
	}
	w.Write(jsonResp)
}

func Endpoints(r *mux.Router) {
	api := r.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/answers", saveAnswers).Methods(http.MethodPost)
}
