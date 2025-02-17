const bouton = document.getElementById("bouton");


boutonFige = false;

bouton.addEventListener("mouseover", () => {

    bouton.addEventListener('click', figeFonc);
    function figeFonc() {
        boutonFige = true;
    }

    if (boutonFige == true) return;

    setTimeout(() => {
        const largeurFenetre = window.innerWidth;
        const hauteurFenetre = window.innerHeight;

        const nouvelleX = Math.random() * (largeurFenetre - bouton.clientWidth);
        const nouvelleY = Math.random() * (hauteurFenetre - bouton.clientHeight);

        bouton.style.left = nouvelleX + "px";
        bouton.style.top = nouvelleY + "px";
    }, 1000);
});
