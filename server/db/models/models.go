package models

import (
	"time"

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
