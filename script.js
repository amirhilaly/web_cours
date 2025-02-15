// Créer un canvas pour les effets
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '9999';
canvas.style.pointerEvents = 'none'; // Permettre les clics à travers le canvas

// Variables pour les particules
let particles = [];

// Classe pour les particules
class Particle {
    constructor(x, y, color, velocity, size, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.size = size;
        this.life = life;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.size *= 0.98; // Réduire la taille
        this.alpha -= 0.02; // Réduire l'opacité
        this.life--;
    }
}

// Fonction pour créer une explosion
function createExplosion(x, y, color) {
    for (let i = 0; i < 50; i++) {
        const velocity = {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5
        };
        particles.push(new Particle(x, y, color, velocity, Math.random() * 5 + 2, 100));
    }
}

// Fonction pour créer du feu
function createFire(x, y) {
    for (let i = 0; i < 20; i++) {
        const velocity = {
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * -3
        };
        particles.push(new Particle(x, y, `rgba(255, ${Math.random() * 100}, 0, 1)`, velocity, Math.random() * 4 + 2, 50));
    }
}

// Fonction pour créer du plasma
function createPlasma(x, y) {
    for (let i = 0; i < 30; i++) {
        const velocity = {
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 3
        };
        particles.push(new Particle(x, y, `rgba(0, ${Math.random() * 255}, 255, 1)`, velocity, Math.random() * 6 + 3, 75));
    }
}

// Fonction pour créer de l'électricité
function createElectricity(x, y) {
    for (let i = 0; i < 10; i++) {
        const velocity = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10
        };
        particles.push(new Particle(x, y, `rgba(255, 255, ${Math.random() * 255}, 1)`, velocity, Math.random() * 3 + 1, 30));
    }
}

// Animation des particules
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        if (particle.life <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
            particle.draw();
        }
    });
}

// Démarrer l'animation
animateParticles();

// Ajouter des écouteurs d'événements pour les boutons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Choisir un effet aléatoire
        const effects = [createExplosion, createFire, createPlasma, createElectricity];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect(x, y, `hsl(${Math.random() * 360}, 100%, 50%)`);
    });
});

$(document).ready(function () {

    function getSelectedCountry() {
        return $('#drop').val();
    }

    let ready = false;

    $('#gameBtn').click(function () {
        window.location.href = "game.html";
    });

    $('#navet-btn').click(function () {
        $('#navet-range-bomb').toggle();
    });

    $('#classique-btn').click(function () {
        $('#classique-range').toggle();
    });

    $('#add-film-btn').click(function () {
        $('#add-movie').toggle();
    });

    $('#load-movies-btn').click(function () {
        const selectedCountry = $('#drop').val();
        const navetValue = $('#navet').val();
        const classiqueValue = $('#classique').val();

        let url = `http://localhost:8080/movies?origine=${selectedCountry}`;

        if ($('#navet-range-bomb').is(':visible')) {
            url += `&noteMax=${navetValue}`;
        } else if ($('#classique-range').is(':visible')) {
            url += `&noteMin=4.2`;
        }

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (moviesData) {
                const template = document.getElementById('movie-template');
                const container = $('#movies-list');
                container.empty();

                $.each(moviesData, function (i, movie) {
                    const instance = document.importNode(template.content, true);
                    $(instance).find('.nom').text(movie.nom);
                    $(instance).find('.dateDeSortie').text(movie.dateDeSortie);
                    $(instance).find('.realisateur').text(movie.realisateur);
                    $(instance).find('.note').text(movie.note);
                    $(instance).find('.notePublic').text(movie.notePublic || "N/A");
                    $(instance).find('.compagnie').text(movie.compagnie);
                    $(instance).find('.description').text(movie.description);
                    $(instance).find('.lienImage').attr('src', movie.lienImage);
                    $(instance).find('.bomb').attr("data-id", movie.id);

                    if (movie.note >= 4.2) {
                        $(instance).find('.movie')[0].style.border = "3px solid gold";
                    }

                    container.append(instance);
                });
            },
            error: function (xhr, status, error) {
                console.error("Erreur :", error);
            }
        });
    });



    $(document).on("click", ".edit", function () {
        const movieElement = $(this).closest(".movie");
        const movieId = movieElement.find(".bomb").data("id");



        $('#edit-movie-id').val(movieId);
        $('#edit-nom').val(movieElement.find('.nom').text());
        $('#edit-dateDeSortie').val(movieElement.find('.dateDeSortie').text());
        $('#edit-realisateur').val(movieElement.find('.realisateur').text());
        $('#edit-note').val(movieElement.find('.note').text());
        $('#edit-notePublic').val(movieElement.find('.notePublic').text());
        $('#edit-compagnie').val(movieElement.find('.compagnie').text());
        $('#edit-description').val(movieElement.find('.description').text());
        $('#edit-lienImage').val(movieElement.find('.lienImage').attr('src'));
        $('#edit-origine').val(movieElement.find('.origine').text());

        $('#edit-movie-form').show();
    });

    $(document).on("click", ".bomb", function () {
        console.log("AAAAAAH BOMBE ALERTE A LA BOOOOMBEEEE");
        const movieId = $(this).data("id");
        fetch(`http://localhost:8080/movies/${movieId}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    $(this).closest(".movie").remove();
                } else {
                    alert("Erreur : " + data.error);
                }
            })
            .catch(error => console.error("Erreur :", error));
    }
    );


    $('#edit-form').submit(function (event) {
        event.preventDefault();

        const movieId = $('#edit-movie-id').val();
        const formData = {
            nom: $('#edit-nom').val(),
            realisateur: $('#edit-realisateur').val(),
            compagnie: $('#edit-compagnie').val(),
            dateDeSortie: $('#edit-dateDeSortie').val(),
            note: parseFloat($('#edit-note').val()),
            notePublic: parseFloat($('#edit-notePublic').val()),
            description: $('#edit-description').val(),
            lienImage: $('#edit-lienImage').val(),
            origine: $('#edit-origine').val()
        };

        $.ajax({
            url: `http://localhost:8080/movies/${movieId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.success) {
                    alert("Film modifié avec succès !");
                    $('#edit-movie-form').hide(); // Masquer le formulaire
                    $('#load-movies-btn').click(); // Rafraîchir la liste des films
                } else {
                    alert('Erreur lors de la modification du film : ' + response.error);
                }
            },
            error: function (xhr, status, error) {
                console.error("Erreur :", error);
                alert('Erreur lors de la modification du film.');
            }
        });
    });

    $('#cancel-edit').click(function () {
        $('#edit-movie-form').hide();
    });

    $('#add-movie').submit(function (event) {
        event.preventDefault();

        const formData = {
            nom: $('#nomFORM').val(),
            realisateur: $('#realisateurFORM').val(),
            compagnie: $('#compagnieFORM').val(),
            dateDeSortie: $('#dateDeSortieFORM').val(),
            note: parseFloat($('#noteFORM').val()),
            notePublic: parseFloat($('#notePublicFORM').val()),
            description: $('#descriptionFORM').val(),
            lienImage: $('#lienImageFORM').val(),
            origine: $('#origineFORM').val()
        };

        $.ajax({
            url: 'http://localhost:8080/movies',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.success) {
                    alert("AAAAAH");
                    $('#add-movie-form')[0].reset(); // Réinitialise le formulaire
                } else {
                    alert('Erreur lors de l\'ajout du film : ' + response.error);
                }
            },
            error: function (xhr, status, error) {
                console.error("Erreur :", error);
                alert('Erreur lors de l\'ajout du film.');
            }
        });
    });
});
