const bouton = document.getElementById("bouton");

bouton.addEventListener("mouseover", () => {
    const largeurFenetre = window.innerWidth;
    const hauteurFenetre = window.innerHeight;

    // Génère des positions aléatoires dans la fenêtre
    const nouvelleX = Math.random() * (largeurFenetre - bouton.clientWidth);
    const nouvelleY = Math.random() * (hauteurFenetre - bouton.clientHeight);

    bouton.style.left = nouvelleX + "px";
    bouton.style.top = nouvelleY + "px";
});