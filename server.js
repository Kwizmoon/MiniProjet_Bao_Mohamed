// ============================================================
// MINI-PROJET — Carnet de contacts (Serveur)
// 420-245-AH | Programmation Web 1 | Collège Ahuntsic
//
// Équipe :
//   Nom 1 : Mohamed Banwan 
//   Nom 2 : Bao Tran Bach
//
// Date : ___2026-05-11__
// ============================================================

// 1. Importer les modules nécessaires
//    - express
//    - mongoose
//    - cors
//    - Le modèle Contact depuis ./models/Contact.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/Contact");

const app = express();

// 2. Créer l'application Express et configurer les middlewares
//    - express.json() pour parser le body des requêtes
//    - cors() pour autoriser les requêtes du client

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// 3. Connexion à MongoDB
//    - URL : mongodb://localhost:27017/carnet_contacts
mongoose.connect("mongodb://localhost:27017/carnet_contacts")
    .then(() => {
        console.log("Connecté à MongoDB (•‿•)");
    })
    .catch((err) => {
        console.log("Erreur MongoDB : " + err)
    })

// 4. Routes API

// GET /api/contacts — Récupérer tous les contacts
app.get("/api/contacts", async(req,res) => {
    try{
        let contacts = await Contact.find();
        res.json(contacts);
    }catch(error){
        res.status(500).json({message : `${req.params.id} : Contact non trouvé`, Erreur : error})
    }
})

// GET /api/contacts/:id — Récupérer un contact par son id
app.get("/api/contacts/:id", async(req,res) => {
    try{
        let contact = await Contact.findById(req.params.id);
        if(!contact){
            return res.status(404).json({message : `${req.params.id} : Contact non trouvé`})
        }
            res.json(contact);
        
    }catch(err){
        res.status(404).json({message : `${req.params.id} : Contact non trouvé`, Erreur : err})
    }
})

// POST /api/contacts — Ajouter un nouveau contact
app.post("/api/contacts", async(req,res) => {
    try{
        let newContact = await new Contact({
            nom : req.body.nom,
            prenom : req.body.prenom,
            telephone : req.body.telephone,
            email : req.body.email,
            categorie : req.body.categorie
        }).save();
        res.status(201).json(newContact);

    }catch(error){
        res.status(400).json({message : "Données invalides !"})
    }
})

// PUT /api/contacts/:id — Modifier un contact existant
app.put("/api/contacts/:id", async(req,res) => {
    try{
        let contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                nom : req.body.nom, 
                prenom : req.body.prenom, 
                telephone : req.body.telephone, 
                email : req.body.email, 
                categorie : req.body.categorie},

            {returnDocument : `after`}
        );
        if(!contact){
            res.status(404).json({message : `${req.params.id} - Contact introuvable`});
        }
        res.json(contact);
    }catch(error){
        res.status(404).json({message : `${req.params.id} - Contact introuvable`, Erreur : error.message})
    }
})

// DELETE /api/contacts/:id — Supprimer un contact
app.delete("/api/contacts/:id", async(req,res) => {
    try{
        let contact = await Contact.findByIdAndDelete(req.params.id)
        if(!contact){
            res.status(404).json({message : `${req.params.id} - Contact introuvable`});
        }
        res.json(contact);
    }catch(error){
        res.status(404).json({message : `${req.params.id} - Contact introuvable`});
    }
})

// 5. Démarrer le serveur sur le port 3000
app.listen(3000, () => {console.log("Serveur démarré sur http://localhost:3000")});