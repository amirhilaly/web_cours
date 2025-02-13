$(document).ready(function () {

    function getSelectedCountry() {
        return $('#drop').val(); // Récupère la valeur de la dropdown
    }

    $('#navet-btn').click(function () {
        $('#navet-range-bomb').toggle();
    });

    $('#load-movies-btn').click(function () {
        $.ajax({
            url: 'http://localhost:8080/movies',
            type: 'GET',
            dataType: 'json',
            success: function (moviesData) {
                const template = document.getElementById('movie-template');
                const container = $('#movies-list');
                const selectedCountry = getSelectedCountry(); // Pays sélectionné
                let megaBomb = 0;
                container.empty(); // Vider le conteneur

                $.each(moviesData, function (i, movie) {
                    const selectedCountry = getSelectedCountry();
                    if (selectedCountry === "all" || movie.origine === selectedCountry) {
                        const instance = document.importNode(template.content, true);
                        $(instance).find('.realisateur').text(movie.realisateur);
                        $(instance).find('.compagnie').text(movie.compagnie);
                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.dateDeSortie').text(movie.dateDeSortie);
                        $(instance).find('.note').text(movie.note);

                        if (movie.note >= 4.2) {
                            $(instance).find('.movie')[0].style.border = "3px solid gold";
                        }
                        if (movie.notePublic) {
                            $(instance).find(".notePublic").text(movie.notePublic);
                        } else {
                            $(instance).find(".notePublic").text("N/A");
                        }

                        if (movie.note > movie.notePublic) {
                            megaBomb = megaBomb + (movie.note - movie.notePublic);
                        } else {
                            megaBomb = megaBomb + (movie.notePublic - movie.note);
                        }
                        $(instance).find('.diffNote').text(megaBomb.toFixed(1));
                        $(instance).find('.description').text(movie.description);
                        $(instance).find('.lienImage').attr('src', movie.lienImage);
                        $(instance).find('.bomb').attr("data-id", movie.id);
                        container.append(instance);
                    }
                });
                document.getElementById("diff").innerText = megaBomb;
            },
            error: function (xhr, status, error) {
                console.error("An error occurred: " + error);
            }
        });
    });

    $("#load-movies-NAVET").click(function () {
        $.ajax({
            url: 'movies.json',
            type: 'GET',
            dataType: 'json',
            success: function (moviesData) {
                const templateNavet = document.getElementById('movie-navet');
                const container = $('#movies-list');
                const selectedCountry = getSelectedCountry();
                const navetValue = $('#navet').val();

                container.empty(); // Vider le conteneur

                $.each(moviesData, function (i, movie) {
                    const selectedCountry = getSelectedCountry();
                    if ((selectedCountry === "all" || movie.origine === selectedCountry) && movie.note <= navetValue) {
                        const instance = document.importNode(templateNavet.content, true);
                        $(instance).find('.nom').text(movie.nom);

                        if (movie.notePublic) {
                            $(instance).find(".notePublic").text(movie.notePublic);
                        } else {
                            $(instance).find(".notePublic").text("N/A");
                        }
                        $(instance).find('.lienImage').attr('src', movie.lienImage);
                        container.append(instance);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("An error occurred: " + error);
            }
        });
    });

    $('#load-movies-CLASSICO').click(function () {
        $.ajax({
            url: 'movies.json',
            type: 'GET',
            dataType: 'json',
            success: function (moviesData) {
                const template = document.getElementById('movie-classic');
                const container = $('#movies-list');
                const selectedCountry = getSelectedCountry();

                container.empty(); // Vider le conteneur

                $.each(moviesData, function (i, movie) {
                    const selectedCountry = getSelectedCountry();
                    if ((selectedCountry === "all" || movie.origine === selectedCountry) && movie.note >= 4.2) {
                        const instance = document.importNode(template.content, true);
                        $(instance).find('.realisateur').text(movie.realisateur);
                        $(instance).find('.compagnie').text(movie.compagnie);
                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.dateDeSortie').text(movie.dateDeSortie);
                        $(instance).find('.note').text(movie.note);

                        if (movie.note >= 4.2) {
                            $(instance).find('.movie')[0].style.border = "3px solid gold";
                        }

                        if (movie.notePublic) {
                            $(instance).find(".notePublic").text(movie.notePublic);
                        } else {
                            $(instance).find(".notePublic").text("N/A");
                        }

                        $(instance).find('.description').text(movie.description);
                        $(instance).find('.lienImage').attr('src', movie.lienImage);
                        $(instance).find('.bomb').attr("data-id", movie.id);
                        container.append(instance);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("An error occurred: " + error);
            }
        });
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
