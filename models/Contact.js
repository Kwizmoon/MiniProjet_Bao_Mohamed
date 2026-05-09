// ============================================================
// MINI-PROJET — Modèle Contact (Mongoose)
// 420-245-AH | Programmation Web 1 | Collège Ahuntsic
// ============================================================

// 1. Importer mongoose

const mongoose = require("mongoose");

// 2. Créer le schéma du contact
//    Champs : nom, prenom, telephone, email, categorie
//    Tous les champs sont de type String et requis (required: true)

const contactSchema = new mongoose.Schema({
    nom : {type : String, required : true},
    prenom : {type : String, required : true},
    telephone : {type: String, required : true},
    email : {type : String, required : true},
    categorie : {type : String, required : true}
})

// 3. Créer le modèle à partir du schéma
const Contact = mongoose.model("Contact", contactSchema);

// 4. Exporter le modèle
module.exports = Contact;