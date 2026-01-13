let donnees = [];
let resultatsFiltres = [];

const statusDiv = document.getElementById('status');
const searchInput = document.getElementById('search');
const resultatsDiv = document.getElementById('resultats');

/* === MODAL ELEMENTS === */
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

const modalName = document.getElementById('modalName');
const modalSite = document.getElementById('modalSite');
const modalCode = document.getElementById('modalCode');
const modalEnseigne = document.getElementById('modalEnseigne');
const modalCommune = document.getElementById('modalCommune');
const modalSDA = document.getElementById('modalSDA');
const modalMail = document.getElementById('modalMail');

/* ===============================
   Chargement CSV
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
            statusDiv.innerText = `✅ ${donnees.length} contacts chargés.`;
            statusDiv.className = "status-msg success";
            afficher(donnees.slice(0, 5));
        }
    }
});

/* ===============================
   Affichage
   =============================== */
function afficher(liste) {
    resultatsDiv.innerHTML = '';

    liste.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `contact ${index === 0 ? 'highlight' : ''}`;

        div.innerHTML = `
            <span class="name" data-index="${donnees.indexOf(item)}">
                ${item.Nom} ${item.Prenom}
            </span>

            <div class="actions">
                <a class="btn btn-call" href="${item.LienAppel}" target="_blank">
                    <img src="img/tél.png">
                </a>
                <a class="btn btn-chat" href="${item.LienChat}" target="_blank">
                <img src="img/chat.png">
                </a>
                <a class="btn btn-mail" href="${item.LienOutlook}" target="_blank">
                    <img src="img/mail.png">
                </a>
            </div>
        `;

        resultatsDiv.appendChild(div);
    });

    // clic sur nom
    document.querySelectorAll('.name').forEach(el => {
        el.addEventListener('click', () => {
            const user = donnees[el.dataset.index];
            ouvrirModal(user);
        });
    });
}

/* ===============================
   MODAL
   =============================== */
function ouvrirModal(user) {
    modalName.textContent = `${user.Prenom} ${user.Nom}`;
    modalSite.textContent = user["Nom du site"] || "";
    modalCode.textContent = user["Code Site"] || "";
    modalEnseigne.textContent = user.Enseigne || "";
    modalCommune.textContent = user.Commune || "";
    modalSDA.textContent = user.SDA || "";
    modalMail.textContent = user.Mail || "";

    modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
});

/* ===============================
   Recherche
   =============================== */
searchInput.addEventListener('input', e => {
    const val = e.target.value.toLowerCase();

    resultatsFiltres = donnees.filter(d =>
        d.Nom.toLowerCase().includes(val) ||
        d.Prenom.toLowerCase().includes(val)
    );

    afficher(resultatsFiltres.slice(0, 5));
});
