let donnees = [];
let resultatsFiltres = [];

const statusDiv = document.getElementById('status');
const searchInput = document.getElementById('search');
const resultatsDiv = document.getElementById('resultats');

/* ===============================
   Chargement du CSV
   =============================== */
Papa.parse("./Annuaire_Teams_Trie.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {
        donnees = results.data;
        resultatsFiltres = donnees;

        if (donnees.length > 0) {
            statusDiv.innerText = "✅ " + donnees.length + " contacts chargés.";
            statusDiv.className = "status-msg success";
            afficher(donnees.slice(0, 5));
        } else {
            statusDiv.innerText = "⚠️ Fichier vide ou mal formaté.";
            statusDiv.className = "status-msg error";
        }
    },

    error: function() {
        statusDiv.innerText = "❌ Erreur : Fichier introuvable ou blocage navigateur (Utilisez Live Server).";
        statusDiv.className = "status-msg error";
    }
});

/* ===============================
   Affichage
   =============================== */
function afficher(liste) {
    resultatsDiv.innerHTML = '';

    if (liste.length === 0) {
        resultatsDiv.innerHTML = '<p style="color:#999; text-align:center;">Aucun résultat</p>';
        return;
    }

    liste.forEach((item, index) => {
        const isFirst = index === 0;
        const nom = item.Nom || item.NOM || "";
        const prenom = item.Prenom || item.PRENOM || "";

        const div = document.createElement('div');
        div.className = `contact ${isFirst ? 'highlight' : ''}`;

        div.innerHTML = `
            <span class="name">${nom} ${prenom}</span>
            <span class="btn-appel">Appuyer sur Entrée</span>
        `;

        resultatsDiv.appendChild(div);
    });
}

/* ===============================
   Recherche
   =============================== */
searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();

    resultatsFiltres = donnees.filter(d => {
        const n = (d.Nom || "").toLowerCase();
        const p = (d.Prenom || "").toLowerCase();
        return n.includes(val) || p.includes(val);
    });

    afficher(resultatsFiltres.slice(0, 5));
});

/* ===============================
   Entrée = appel Teams
   =============================== */
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && resultatsFiltres.length > 0) {
        const lien = resultatsFiltres[0].Lien || resultatsFiltres[0].lien;

        if (lien && lien.trim() !== "") {
            window.location.href = lien;
        } else {
            alert("Pas de lien trouvé pour ce contact dans la colonne 'Lien'.");
        }
    }
});
