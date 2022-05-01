package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
)

type Answers struct {
	Leeftijd, Studiejaar          int
	Opleiding, LidRaad, Faculteit string
	BetrokkenheidOpleiding        int
	BetrokkenheidHogeschool       int
	BelangrijkeOnderwerpen        []string
	CMR                           Medezeggenschapsraad
	Faculteitsraad                Faculteitsraad
}

type Medezeggenschapsraad struct {
	KennisBestaan           string
	KennisRol               string
	KrijgtInfo              string
	SoortInfo               []string
	MeerWeten               string
	BeoordelingCommunicatie int
}

type Faculteitsraad struct {
	Medezeggenschapsraad
	KennisVerschilCMR string
}

func saveAnswers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var answers Answers
	decoder := schema.NewDecoder()
	err = decoder.Decode(answers, r.PostForm)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		resp := make(map[string]string)
		resp["message"] = "Data malformed"
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Fatalf("Error in JSON marshal: %s", err)
		}
		w.Write(jsonResp)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func Endpoints(r *mux.Router) {
	api := r.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/answers", saveAnswers).Methods(http.MethodPost, http.MethodOptions)
	api.Use(mux.CORSMethodMiddleware(r))
}
