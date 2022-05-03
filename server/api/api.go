package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"studentsurvey/server/db"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Answers struct {
	ID                      primitive.ObjectID   `bson:"_id,omitempty"`
	TimeOfSubmission        time.Time            `bson:"time_of_submission"`
	Leeftijd                int                  `schema:"leeftijd" bson:"leeftijd"`
	Studiejaar              int                  `schema:"studiejaar" bson:"studiejaar"`
	Opleiding               string               `schema:"opleiding" bson:"opleiding"`
	Faculteit               string               `schema:"faculteit" bson:"faculteit"`
	LidRaad                 string               `schema:"lid-raad" bson:"lid_raad"`
	BetrokkenheidOpleiding  int                  `schema:"betrokkenheid-opleiding" bson:"betrokkenheid_opleiding"`
	BetrokkenheidHogeschool int                  `schema:"betrokkenheid-hogeschool" bson:"betrokkenheid_hogeschool"`
	BelangrijkeOnderwerpen  []string             `schema:"onderwerpen-belangrijk-studie" bson:"belangrijke_onderwerpen_studie,omitempty"`
	CMR                     Medezeggenschapsraad `schema:"cmr" bson:"centrale_medezeggenschapsraad"`
	Faculteitsraad          Faculteitsraad       `schema:"faculteitsraad" bson:"faculteitsraad"`
}

type Medezeggenschapsraad struct {
	KennisBestaan           string   `schema:"bestaan" bson:"bestaan"`
	KennisRol               string   `schema:"kennis" bson:"kennis"`
	KrijgtInfo              string   `schema:"informatie" bson:"krijgt_info"`
	SoortInfo               []string `schema:"soort-informatie" bson:"soort_info_cmr,omitempty"`
	MeerWeten               string   `schema:"meer-weten" bson:"meer_weten"`
	BeoordelingCommunicatie int      `schema:"communicatie-naar-student" bson:"beoordeling_communicatie"`
}

type Faculteitsraad struct {
	Medezeggenschapsraad `bson:"inline"`
	KennisVerschilCMR    string `schema:"kennis-verschil-cmr" bson:"kennis_verschil_cmr"`
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
