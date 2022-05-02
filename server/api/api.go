package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
)

type Answers struct {
	Leeftijd                int                  `schema:"leeftijd"`
	Studiejaar              int                  `schema:"studiejaar"`
	Opleiding               string               `schema:"opleiding"`
	Faculteit               string               `schema:"faculteit"`
	LidRaad                 string               `schema:"lid-raad"`
	BetrokkenheidOpleiding  int                  `schema:"betrokkenheid-opleiding"`
	BetrokkenheidHogeschool int                  `schema:"betrokkenheid-hogeschool"`
	BelangrijkeOnderwerpen  []string             `schema:"onderwerpen-belangrijk-studie"`
	CMR                     Medezeggenschapsraad `schema:"cmr"`
	Faculteitsraad          Faculteitsraad       `schema:"faculteitsraad"`
}

type Medezeggenschapsraad struct {
	KennisBestaan           string   `schema:"bestaan"`
	KennisRol               string   `schema:"kennis"`
	KrijgtInfo              string   `schema:"informatie"`
	SoortInfo               []string `schema:"soort-informatie"`
	MeerWeten               string   `schema:"meer-weten"`
	BeoordelingCommunicatie int      `schema:"communicatie-naar-student"`
}

type Faculteitsraad struct {
	KennisBestaan           string   `schema:"bestaan"`
	KennisRol               string   `schema:"kennis"`
	KennisVerschilCMR       string   `schema:"kennis-verschil-cmr"`
	KrijgtInfo              string   `schema:"informatie"`
	SoortInfo               []string `schema:"soort-informatie"`
	MeerWeten               string   `schema:"meer-weten"`
	BeoordelingCommunicatie int      `schema:"communicatie-naar-student"`
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
	err = decoder.Decode(&answers, r.PostForm)
	if err != nil {
		fmt.Printf("error: %v", err)
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
