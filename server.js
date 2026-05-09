// ============================================================
// MINI-PROJET — Carnet de contacts (Serveur)
// 420-245-AH | Programmation Web 1 | Collège Ahuntsic
//
// Équipe :
//   Nom 1 : Mohamed Banwan 
//   Nom 2 : Bao Tran Bach
//
// Date : ___2026-04-27__--
// ============================================================

// 1. Importer les modules nécessaires
//    - express
//    - mongoose
//    - cors
//    - Le modèle Contact depuis ./models/Contact.js
const express = requie("express");
const app = express();
const mongoose = require("mongoose");
const Contact = require("./models/Contact");

// 2. Créer l'application Express et configurer les middlewares
//    - express.json() pour parser le body des requêtes
//    - cors() pour autoriser les requêtes du client
app.use(express.static("public"));
app.use(express.json());

// 3. Connexion à MongoDB
//    - URL : mongodb://localhost:27017/carnet_contacts
mongoose.connect("mongodb://localhost:27017/carnet_contacts")
    .then(() => {
        console.log("Connecté à MongoB");
    })
    .catch((err) => {
        console.log("Erreur MongoDB : " + err)
    })

// 4. Routes API

// GET /api/contacts — Récupérer tous les contacts
app.get("/api/contacts", (req,res) => {
    try{
        let contacts = await Contact.find();
        res.json(contacts);
    }catch(error){
        res.status(400).json({message : `${id} : Contact non trouvé`, Erreur : error})
    }
})

// GET /api/contacts/:id — Récupérer un contact par son id
app.get("/api/contacts/:id", (req,res) => {
    try{
        let contact = await Contact.findById(
            req.params.id,
            {returnDocument : `after`}
        );
        if(!contact){
            res.status(404).json({message : `${id} : Contact non trouvé`})
        }else{
            res.json(contact)
        }
    }catch(err){
        res.status(404).json({message : `${id} : Contact non trouvé`, Erreur : error})
    }
})

// POST /api/contacts — Ajouter un nouveau contact
app.post("/api/contacts", async(req,res) => {

    try{
        let newContact = new Contact({
            nom : req.body.nom,
            prenom : req.params.prenom,
            telephone : req.params.telephone,
            email : req.params.email,
            categorie : req.param.categorie
        }).save();
        res.status(201).json(newContact);

    }catch(error){
        res.status(400).json({message : "Données invalides !"})
    }
})

// PUT /api/contacts/:id — Modifier un contact existant
app.put("/api/contacts/:id", async(req,res) => {
    try{
        let contact = await Contact.findByIdAndUpdate(req.params.id);
        if(!contact){
            res.status(404).json({message : `${id} - Contact introuvable`});
        }
        res.json(contact);
    }catch(error){
        res.status(404).json({message : `${id} - Contact introuvable`, Erreur : error.message})
    }
})

// DELETE /api/contacts/:id — Supprimer un contact
app.delete("/api/contacts/:id", (req,res) => {
    try{
        let contact = await Contact.findByIdAndDelete(req.params.id)
        if(!contact){
            res.status(404).json({message : `${id} - Contact introuvable`});
        }
        res.json(contact);
    }catch(error){
        res.status(404).json({message : `${id} - Contact introuvable`});
    }
})

// 5. Démarrer le serveur sur le port 3000
app.listen(3000, () => {console.log("Serveur démarré sur http://localhost:3000")});