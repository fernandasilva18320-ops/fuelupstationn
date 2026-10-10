/* =========================================================
   FUELUP STATION
   SCRIPT.JS
========================================================= */


/* =========================================================
   MENU MOBILE
========================================================= */

const menuButton = document.getElementById("menuButton");

const nav = document.getElementById("nav");


if (menuButton && nav) {

    menuButton.addEventListener("click", function () {

        nav.classList.toggle("open");

    });


    const navLinks = nav.querySelectorAll("a");


    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            nav.classList.remove("open");

        });

    });

}


/* =========================================================
   MAPA INTERATIVO
========================================================= */

const locationCards =
    document.querySelectorAll(".location-card");

const mapFrame =
    document.getElementById("mapFrame");


locationCards.forEach(function (card) {


    card.addEventListener("click", function (event) {


        /*
         Não muda o mapa quando o usuário
         clicar diretamente no botão "VER ROTA".
        */

        if (
            event.target.tagName.toLowerCase() === "a"
        ) {

            return;

        }


        /* Remove ativo de todos */

        locationCards.forEach(function (item) {

            item.classList.remove("active");

        });


        /* Ativa o selecionado */

        card.classList.add("active");


        /* Pega localização */

        const location =
            card.getAttribute("data-map");


        if (!location || !mapFrame) {

            return;

        }


        /*
         Atualiza o Google Maps
        */

        const encodedLocation =
            encodeURIComponent(location);


        mapFrame.src =
            "https://www.google.com/maps?q=" +
            encodedLocation +
            "&output=embed";


    });

});


/* =========================================================
   ANO AUTOMÁTICO
========================================================= */

const year =
    document.getElementById("year");


if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =========================================================
   ANIMAÇÃO DE ENTRADA
========================================================= */

const observer =
    new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


const animatedElements =
    document.querySelectorAll(
        ".feature-card, .location-card, .contact-form"
    );


animatedElements.forEach(function (element) {

    observer.observe(element);

});


/* =========================================================
   FORMULÁRIO DE CONTATO — ENVIO SEM SAIR DO SITE
========================================================= */

const form = document.querySelector(".contact-form");

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const emailField = form.querySelector("#email");
        const replyToField = form.querySelector("#replyToField");
        const button = form.querySelector('button[type="submit"]');
        const warning = form.querySelector(".form-warning");
        const originalButtonText = button ? button.innerHTML : "ENVIAR MENSAGEM";

        if (!form.reportValidity()) return;

        if (emailField && replyToField) {
            replyToField.value = emailField.value.trim();
        }

        if (button) {
            button.disabled = true;
            button.textContent = "ENVIANDO...";
        }
        if (warning) warning.textContent = "Enviando sua mensagem...";

        try {
            // O endpoint AJAX do FormSubmit espera os dados em JSON.
            const payload = Object.fromEntries(new FormData(form).entries());
            const response = await fetch("https://formsubmit.co/ajax/contato@fuelupstation.com.br", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const responseText = await response.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch {
                throw new Error("O serviço de e-mail não retornou uma resposta válida.");
            }

            if (!response.ok || result.success === false || result.success === "false" || result.success === undefined) {
                throw new Error(result.message || result.error || "O serviço recusou o envio.");
            }

            if (warning) {
                warning.textContent = "Mensagem enviada! Obrigado por entrar em contato com a FuelUp Station.";
            }
            form.reset();
            if (replyToField) replyToField.value = "";
            if (button) button.textContent = "MENSAGEM ENVIADA ✓";
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            if (warning) {
                warning.textContent = "Não foi possível enviar a mensagem. Confira sua conexão e tente novamente. Se o erro continuar, confirme a ativação do endereço no FormSubmit ou entre em contato pelo e-mail contato@fuelupstation.com.br.";
            }
            if (button) {
                button.disabled = false;
                button.innerHTML = originalButtonText;
            }
        }
    });
}
