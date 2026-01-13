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
    delimiter: ";",

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
        statusDiv.innerText = "❌ Erreur de chargement du fichier CSV.";
        statusDiv.className = "status-msg error";
    }
});

/* ===============================
   Affichage des contacts
   =============================== */
function afficher(liste) {
    resultatsDiv.innerHTML = '';

    if (liste.length === 0) {
        resultatsDiv.innerHTML = '<p style="color:#999;text-align:center;">Aucun résultat</p>';
        return;
    }

    liste.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `contact ${index === 0 ? 'highlight' : ''}`;

        div.innerHTML = `
            <span class="name">${item.Nom} ${item.Prenom}</span>
            <div class="actions">
                <a class="btn btn-call"
                    href="${item.LienAppel || '#'}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Appeler">
                        <img src="img/tél.png" alt="Appeler">
                </a>
                <a class="btn btn-chat"
                    href="${item.LienChat || '#'}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Message Teams">
                    <img src="img/chat.png" alt="Message Teams">
                </a>

                <a class="btn btn-mail"
                    href="${item.LienOutlook || '#'}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Envoyer un mail">✉️</a>
            </div>
        `;

        resultatsDiv.appendChild(div);
    });
}

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href') === '#') {
        e.preventDefault();
    }
});

/* ===============================
   Recherche
   =============================== */
searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();

    resultatsFiltres = donnees.filter(d =>
        d.Nom.toLowerCase().includes(val) ||
        d.Prenom.toLowerCase().includes(val)
    );

    afficher(resultatsFiltres.slice(0, 5));
});

/* ===============================
   Entrée = appel
   =============================== */
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && resultatsFiltres.length > 0) {
        const lien = resultatsFiltres[0].LienAppel;
        if (lien) window.location.href = lien;
    }
});
