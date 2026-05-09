// ============================================================
// MINI-PROJET — Carnet de contacts
// 420-245-AH | Programmation Web 1 | Collège Ahuntsic
//
// Équipe :
//   Nom 1 : Mohamed Banwan
//   Nom 2 : Bao Tran Bach
//
// Date : __________________________
// ============================================================

const API_URL = "http://localhost:3000/api/contacts";

// VOTRE CODE JAVASCRIPT ICI
// <form id="form-contact">
// id="nom"
// id="prenom"
// id="telephone"
// id="email"
// id="categorie"
// <div id="liste-contacts">
// id="status"
// id="recherche"
// id="compteur"

let elForm = document.querySelector("#form-contact");
let elNom = document.querySelector("#nom");
let elPrenom = document.querySelector("#prenom");
let elTelephone = document.querySelector("#telephone");
let elEmail = document.querySelector("#email");
let elCategorie = document.querySelector("#categorie");
let elListe = document.querySelector("#liste-contacts");
let elStatus = document.querySelector("#status");
let elRecherche = document.querySelector("#recherche");
let elCompteur = document.querySelector("#compteur");
let btnModifier = document.querySelector("[data-js='btn-modifier']");

async function chargerContact(){
    try{
        const response = await fetch("/api/contacts");
        if(!response.ok){
            throw new Error("Erreur HTTP : " + response.status);
        }else{
            const contacts = await response.json();
            afficherContacts(contacts);
            elCompteur.innerHTML += `${contacts.length} contacts${contacts.length > 1 ? "s" : ""} dans votre liste`;
        }
    }catch(error){
        elStatus.textContent = "Erreur - Le serveur n'a pas démarré !";
        console.error(error);
    }
}

function afficherContacts(contacts){
    elListe.innerHTML = "";
    let html = "";

    if(contacts.length === 0){
        elStatus.textContent = "Aucun contact";
        return;
    }else{
        contacts.foreach(contact => {
            
        })
    }
}

//----------------AJOUTER UN CONTACT--------------------//

elForm.addEventListener("submit", async (e) => {   // Hello
    e.preventDefault();

    let isValid = true;

    let nom = elNom.value;
    let prenom = elPrenom.value;
    let telephone = elTelephone.value;
    let email = elEmail.value;
    let categorie = elCategorie.value;

    if(nom.value.length < 2 || nom.value === ""){
        elNom.classList.add("erreur");
        elStatus.textContent = "Nom obligatoire"
        isValid = false;
    }
    if(prenom.value.length < 2 || prenom.value === ""){
        elPrenom.classList.add("erreur");
        elStatus.textContent = "Prénom obligatoire";
        isValid = false;
    }
    if(telephone.value === ""){
        elTelephone.classList.add("erreur");
        elStatus.textContent = "Téléphone obligatoire";
        isValid = false;
    }
    if(email.value === "" || email.value.includes("@")){
        elEmail.classList.add("erreur");
        elStatus.textContent = "Email obligatoire et doit contenir un @";
        isValid = false;
    }
    if(categorie.value === ""){
        elCategorie.classList.add("erreur");
        elStatus.textContent = "Catégorie obligatoire, veuillez sélectionner une caétgorie !"
        isValid = false;
    }

    if(isValid){
        try{
            const response = await fetch("/api/contacts", {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({nom, prenom, telephone, email, categorie})
            })
            if(!response.ok){
                throw new Error("Erreur HTTP : " + response.status);
            }
            elStatus.textContent = "Contact ajouté avec succès !";

        }catch(error){
            elStatus.textContent = `Erreur - Le contact ne peut pas être crée : Champ manquant - `
        }
    }
})

//--------------------SUPPRIMER UN CONTACT----------------------//

// TODO !! ༼ ▀̿̿Ĺ̯̿̿▀̿ ༼ ▀̿̿Ĺ̯̿̿▀̿༽▀̿̿Ĺ̯̿̿▀̿ ༽

//--------------------RECHERCHE DE CONTACT----------------------//

elRecherche.addEventListener("input", async() => {
    let recherche = elRecherche.value.toLowerCase();

    try{
        const response = await fetch("/api/contacts");
        if(!response.ok){
            throw new Error("Erreur HTTP : " + response.status);
        }else{
            const contacts = await response.json();
            let contactsFiltre = contacts.filter(contact => contact.nom.toLowerCase().includes(rechercher));

            afficherContacts(contactsFiltre);
        }
    }catch(error){
        elStatus.textContent = "Erreur de recherche :( !";
        console.error(error);

    }
})

chargerContacts();

