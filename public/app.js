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

async function chargerContacts(){

    try{
        const response = await fetch("/api/contacts");
        if(!response.ok){
            throw new Error("Erreur HTTP : " + response.status);
        }else{
            const contacts = await response.json();
            contacts.sort((a,b) => (a.prenom.toLowerCase() > b.prenom.toLowerCase() ? 1 : -1));
            afficherContacts(contacts);
            elCompteur.innerHTML = `${contacts.length} contact${contacts.length > 1  || contacts.length === 0 ? "s" : ""} dans votre liste`;
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
        contacts.forEach(contact => {

            const categorieType = 
                contact.categorie === "Famille"
                    ? "famille"
                    : contact.categorie === "Ami"
                    ? "ami"
                    : contact.categorie === "Travail"
                    ? "travail"
                    : "autre";

            html += `
                <div class="contact-card" data-id="${contact._id}" data-prenom="${contact.prenom}"
                                          data-nom="${contact.nom}" data-telephone="${contact.telephone}" 
                                          data-email="${contact.email}" data-categorie="${contact.categorie}">
                    <div class="contact-info">
                        <h3>${contact.prenom} ${contact.nom}</h3>
                        <p>${contact.telephone}</p>
                        <p>${contact.email}</p>  
                    </div>
                    <div class="contact-categorie ${categorieType}">
                        ${contact.categorie}
                    </div>
                    <div class="contact-actions">
                        <button class="btn-edit" data-js="btn-edit">Modifier</button>
                        <button class="btn-delete" data-js="btn-delete">🗑</button>
                    </div>
                </div>
            `
        });
        
        elListe.innerHTML = html;


//--------------------MODIFIER / SUPPRIMER UN CONTACT----------------------//

        elListe.addEventListener("click", async(e) => {
            const btnDelete = e.target.closest("[data-js='btn-delete']");
            const btnEdit = e.target.closest("[data-js='btn-edit']")

            if (btnEdit) {
                const carte = btnEdit.closest(".contact-card");
                const btnModifier = document.querySelector("[data-js='btn-modifier']");
                const btnAnnuler = document.querySelector("[data-js='btn-annuler']");

                btnModifier.style.display = "block";
                btnAnnuler.style.display = "block";

                const id = carte.dataset.id;
                const nom = carte.dataset.nom;
                const prenom = carte.dataset.prenom;
                const telephone = carte.dataset.telephone;
                const email = carte.dataset.email;
                const categorie = carte.dataset.categorie;
                
                elNom.value = nom;
                elPrenom.value = prenom;
                elTelephone.value = telephone;
                elEmail.value = email;
                elCategorie.value = categorie;


                btnModifier.addEventListener("click", async() => {

                    const nom = elNom.value;
                    const prenom = elPrenom.value;
                    const telephone = elTelephone.value;
                    const email = elEmail.value;
                    const categorie = elCategorie.value;

                    try{
                    const response = await fetch(`/api/contacts/${id}`, {
                        method : "PUT",
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify({nom, prenom, telephone, email, categorie})
                    })
                    if(!response.ok){
                        throw new Error("Erreur HTTP : " + response.status);
                    }
                    elStatus.textContent = "Contact modifié avec succès !";

                    chargerContacts();

                    }catch(error){
                        elStatus.textContent = `Erreur - Le contact ne peut pas être modifié  - `
                    }
                })

                btnAnnuler.addEventListener("click", () => {

                    elNom.value = "";
                    elPrenom.value = "";
                    elTelephone.value = "";
                    elEmail.value = "";
                    elCategorie.value = "";

                    btnModifier.style.display = "none";
                    btnAnnuler.style.display = "none";
                })

                    
                
            }

            if (btnDelete) {
                const carte = btnDelete.closest(".contact-card");
                const id = carte.dataset.id;
                const prenom = carte.dataset.prenom;

                if (confirm(`Êtes-vous sûre de vouloir supprimer ${prenom}?`)) { // francais!!!!!!!
                    try{
                        const response = await fetch(`/api/contacts/${id}`, { method : "DELETE"})
                        
                        if(!response.ok){
                            throw new Error("Erreur HTTP : " + response.status);
                        }
                        elStatus.textContent = "Contact supprimé avec succès !";

                        chargerContacts();

                    }catch(error){
                        elStatus.textContent = `Erreur - Le contact ne peut pas être supprimé. - `
                    }
                }

            }


            
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

    if(categorie === ""){
        elCategorie.classList.add("erreur");
        elStatus.textContent = "Catégorie obligatoire, veuillez sélectionner une catégorie !";
        isValid = false;
    } else {
        elCategorie.classList.remove("erreur");

    }

    if(!email.includes("@") || email === ""){
        elEmail.classList.add("erreur");
        elStatus.textContent = "Email obligatoire et doit contenir un @";
        isValid = false;
    } else {
        elEmail.classList.remove("erreur");
    }

    if(telephone === ""){
        elTelephone.classList.add("erreur");
        elStatus.textContent = "Téléphone obligatoire";
        isValid = false;
    } else {
        elTelephone.classList.remove("erreur");
    }

    if(prenom.trim().length < 2 || prenom === ""){
        elPrenom.classList.add("erreur");
        elStatus.textContent = "Prénom obligatoire";
        isValid = false;
    } else {
        elPrenom.classList.remove("erreur");
    }

    if(nom.trim().length < 2 || nom === ""){
        elNom.classList.add("erreur");
        elStatus.textContent = "Nom obligatoire"
        isValid = false;
    } else {
        elNom.classList.remove("erreur");
    }

    if(isValid){
        elStatus.textContent = "";
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

            chargerContacts();

        }catch(error){
            elStatus.textContent = `Erreur - Le contact ne peut pas être crée : Champ manquant - `
        }
    }
})



//--------------------RECHERCHE DE CONTACT----------------------//

elRecherche.addEventListener("input", async() => {
    let recherche = elRecherche.value.toLowerCase();

    try{
        const response = await fetch("/api/contacts");
        if(!response.ok){
            throw new Error("Erreur HTTP : " + response.status);
        }else{
            const contacts = await response.json();
            let contactsFiltre = contacts.filter(contact => contact.prenom.toLowerCase().includes(recherche));

            afficherContacts(contactsFiltre);
        }
    }catch(error){
        elStatus.textContent = "Erreur de recherche :( !";
        console.error(error);

    }
})

chargerContacts();

