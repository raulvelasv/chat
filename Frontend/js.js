let i = 1;
var idContacto;
var idConversacion;
var contactoSeleccionado = null;

// Función para enviar el formulario de inicio de sesión
function enviarLogin() {
    // Crear una instancia de XMLHttpRequest
    let http = new XMLHttpRequest();

    // Obtener los valores del correo electrónico y la contraseña del formulario
    let mail = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;

    // Abrir una solicitud GET al servidor con los parámetros de inicio de sesión
    http.open("GET", "http://localhost:3001/LenguajeMarcas/Login?mail=" + mail + "&pass=" + pass, true);
    http.send();

    // Escuchar el evento de cambio de estado de la solicitud
    http.onreadystatechange = function () {
        // Verificar si la solicitud se completó y se obtuvo una respuesta exitosa
        if (http.readyState == 4 && http.status == 200) {
            // Obtener la respuesta del servidor
            let session = this.responseText;
            
            // Verificar si la sesión es válida
            if (session != "false") {
                // Almacenar los datos de inicio de sesión en sessionStorage
                window.sessionStorage.setItem("mail", mail);
                window.sessionStorage.setItem("pass", pass);
                window.sessionStorage.setItem("session", session);

                // Redirigir al usuario a la página de chat después de un retraso de 700 ms
                setTimeout(function () {
                    avanzarChat();
                }, 700);
            } else {
                // Mostrar un mensaje de error si el inicio de sesión es incorrecto
                document.querySelector(".result").innerHTML = "Login incorrecto";
            }
        }
    }
}

// Función para avanzar a la página de chat
function avanzarChat() {
    // Obtener el código de sesión almacenado en sessionStorage
    var codigoSesion = sessionStorage.getItem("session");

    // Verificar si el código de sesión no es igual a cero
    if (codigoSesion != 0) {
        // Redirigir al usuario a la página de chat
        window.location.href = "chat.html";
    }
}

// Función para obtener la lista de países
function getPaises() {
    // Crear una instancia de XMLHttpRequest
    let http = new XMLHttpRequest();

    // Abrir una solicitud GET al servidor para obtener la lista de países
    http.open("GET", "http://localhost:3001/LenguajeMarcas/Register", true);
    http.send();

    // Escuchar el evento de cambio de estado de la solicitud
    http.onreadystatechange = function () {
        // Verificar si la solicitud se completó y se obtuvo una respuesta exitosa
        if (this.readyState == 4 && this.status == 200) {
            // Obtener la respuesta del servidor en formato JSON
            let jsonString = http.responseText;
            let listaPaíses = JSON.parse(jsonString);

            // Recorrer la lista de países y agregar opciones al elemento select
            for (let i = 0; i < listaPaíses.length; i++) {
                let select = document.getElementById("pais");
                let option = document.createElement("option");
                option.text = listaPaíses[i].name;
                option.value = listaPaíses[i].code;
                select.add(option);
            }
        }
    }
}

// Función para enviar el registro de un usuario
function enviarRegistro() {
    var http = new XMLHttpRequest();

    // Obtener los valores del formulario de registro
    let user = document.getElementById("user").value;
    let mail = document.getElementById("mail").value;
    let pais = document.getElementById("pais").value;
    let pass = document.getElementById("pass").value;
    let repeatpass = document.getElementById("repeatpass").value;

    // Verificar si las contraseñas coinciden
    if (pass === repeatpass) {
        // Abrir una solicitud POST al servidor para enviar los datos de registro
        http.open("POST", "http://localhost:3001/LenguajeMarcas/Register", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("user="+user+"&mail="+mail+"&pais="+pais+"&pass="+pass);

        // Escuchar el evento de cambio de estado de la solicitud
        http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Obtener el elemento de resultado
                let resultElement = document.getElementById("result");
                console.log("Registro completado: " + http.responseText);
                resultElement.innerHTML = "Te has registrado correctamente, ya puedes iniciar sesión";
                resultElement.style.color = "#00FF00";
            }
        }
    } else {
        // Mostrar un mensaje de error si las contraseñas no coinciden
        document.getElementById("respuesta").innerHTML = "<p style='color:red'>No coinciden las contraseñas </p>";
    }
}

// Función para cargar contactos en la lista de amigos
function cargarContactos(emailAmigo) {
    let divContactos = document.querySelector(".contenedor-amigos");
    let contenedorPrincipal = document.querySelector(".contenedor-principal");

    // Crear elementos div para representar al amigo y la conversación
    let divAmigo = document.createElement("div");
    let conversacion = document.createElement("div");

    // Asignar clases a los elementos
    divAmigo.classList.add("div-amigo");
    conversacion.classList.add("conversacion");

    // Crear identificadores únicos para los divs usando una variable "i" iterativa
    divAmigo.id = "contacto-" + i;
    divAmigo.textContent = emailAmigo;
    conversacion.id = "conversacion-" + i;
    conversacion.style.display = "none";

    // Agregar eventos de clic al div del amigo para mostrar la conversación correspondiente
    divAmigo.addEventListener("click", function () {
        idContacto = this.id;
        idConversacion = idContacto.replace("contacto", "conversacion");

        mostrarConversacion();
    });

    i++;

    // Agregar los divs a los contenedores correspondientes
    divContactos.appendChild(divAmigo);
    contenedorPrincipal.appendChild(conversacion);
}

// Función para mostrar la conversación con un contacto seleccionado
function mostrarConversacion() {
    // Obtener el div de la conversación y el div del contacto seleccionado
    let conversacion = document.getElementById(idConversacion);
    let contacto = document.getElementById(idContacto);

    // Obtener el color de fondo principal para copiarlo en el contacto seleccionado
    let colorChat = window.getComputedStyle(document.querySelector(".contenedor-principal")).backgroundColor;

    // Restablecer las propiedades del contacto seleccionado anteriormente
    if (contactoSeleccionado) {
        contactoSeleccionado.style.color = "";
        contactoSeleccionado.style.backgroundColor = "";
    }

    // Cambiar el color del contacto seleccionado
    contacto.style.color = "#1e1e1e";
    contacto.style.backgroundColor = "#ffc91d";

    // Ocultar todas las conversaciones
    let listaConversaciones = document.querySelectorAll(".conversacion");
    for (let conver of listaConversaciones) {
        conver.style.display = "none";
    }

    // Mostrar la conversación del contacto seleccionado
    conversacion.style.display = "flex";

    contactoSeleccionado = contacto;
}

// Función para añadir un amigo
function anadirAmigo() {
    let http = new XMLHttpRequest();

    // Obtener el correo y la sesión almacenados en sessionStorage, y el amigo ingresado
    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");
    let friend = document.getElementById("friend").value;

    // Abrir una solicitud POST al servidor para añadir el amigo
    http.open("POST", "http://localhost:3001/LenguajeMarcas/Friend", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("mail="+mail+"&session="+session+"&friend="+friend);

    // Escuchar el evento de cambio de estado de la solicitud
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let respuesta = http.responseText;

            if (respuesta == 0) {
                alert("ERROR. El servidor no responde");
            } else if (respuesta == 1) {
                console.log("Contacto añadido");
                cargarContactos(friend);
            } else if (respuesta == 2) {
                alert("Contacto no encontrado");
            } else if (respuesta == 3) {
                alert("Se acabó la sesión");
                window.open("inicioSesion.html");
            } else if (respuesta == 4) {
                alert("Ese contacto ya está en tu lista");
            }
        }
    }
}

// Función para obtener la lista de amigos
function getFriends() {
    let http = new XMLHttpRequest();
    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");

    // Abrir una solicitud GET al servidor para obtener la lista de amigos
    http.open("GET", "http://localhost:3001/LenguajeMarcas/Friend?mail="+mail+"&session="+session, true);
    http.send();

    // Escuchar el evento de cambio de estado de la solicitud
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let jsonAmigos = JSON.parse(http.responseText);

            // Iterar sobre la lista de amigos y llamar a la función cargarContactos para cada uno
            for (let i = 0; i < jsonAmigos.length; i++) {
                let persona = jsonAmigos[i];
                cargarContactos(persona, i);
            }
        }
    }
}

// Arreglo para almacenar las conversaciones asignadas
var chatsAsignados = [];

// Función para agregar un amigo
function añadirAmigo() {
    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");
    let friend = document.getElementById("friend").value;

    // Abrir una solicitud POST al servidor para agregar un amigo
    http.open("POST", "http://localhost:3001/LenguajeMarcas/Friend", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("mail=" + mail + "&session=" + codigoSesion + "&friend=" + friend);

    // Escuchar el evento de cambio de estado de la solicitud
    http.onreadystatechange = function () {
        let respuesta = http.responseText;

        if (http.readyState == 4 && http.status == 200) {
            if (respuesta == "0") {
                document.getElementById("resultado").innerHTML = "El servidor no responde";
                document.getElementById("resultado").style.color = "red";
            } else if (respuesta == "1") {
                document.getElementById("resultado").innerHTML = "Amigo añadido con éxito";
                document.getElementById("resultado").style.color = "green";
                recibirAmigos();
            } else if (respuesta == "2") {
                document.getElementById("resultado").innerHTML = "Amigo no encontrado";
                document.getElementById("resultado").style.color = "red";
            } else {
                document.getElementById("resultado").innerHTML = "Usuario necesita Login";
                document.getElementById("resultado").style.color = "red";
            }
        }
    }
}

// Función para recibir la lista de amigos
function recibirAmigos() {
    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");

    // Abrir una solicitud GET al servidor para recibir la lista de amigos
    http.open("GET", "http://localhost:3001/LenguajeMarcas/Friend?mail="+mail+"&session="+codigoSesion, true);
    http.send();

    // Escuchar el evento de cambio de estado de la solicitud
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let jsonString = http.responseText;
            let arrayAmigos = JSON.parse(jsonString);
            let selectElement = document.getElementById("listaAmigos");

            // Iterar sobre la lista de amigos y agregar opciones al elemento select
            for (let i in arrayAmigos) {
                let amigo = arrayAmigos[i];
                let option = document.createElement("option");
                option.text = amigo;
                selectElement.add(option);
            }
        }
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Limpiar el almacenamiento de sesión
    sessionStorage.clear();
    // Redirigir a la página de inicio de sesión
    window.location.href = "inicioSesion.html";
}

// Función para recibir mensajes
function recibirMensaje() {
    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");

    // Abrir una solicitud GET al servidor para recibir mensajes
    http.open("GET", "http://localhost:3001/LenguajeMarcas/Xat?mail="+mail+"&session="+codigoSesion, true);
    http.send();

    // Escuchar el evento de cambio de estado de la solicitud
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            let jsonString = http.responseText;
            let respuesta = JSON.parse(jsonString);

            console.log(respuesta);

            let emisor = respuesta.emisor;
            let indiceEmisor = chatsAsignados.indexOf(emisor);

            let nombre = respuesta.emisor.split("@");
            let primeraLetra = nombre[0].charAt(0).toUpperCase();
            let restoDelNombre = nombre[0].slice(1);
            let nombreCompleto = primeraLetra + restoDelNombre;

            console.log(indiceEmisor);
            if (indiceEmisor != -1) {
                // Si el emisor ya tiene una pestaña asignada, mostrar el mensaje en esa pestaña
                let pestaña = document.querySelector("#pestaña-" + indiceEmisor);
                pestaña.innerHTML = nombreCompleto + "<br>";

                let chat = document.querySelector("#chat-" + indiceEmisor);
                chat.innerHTML += nombreCompleto + ": " + respuesta.text + "<br>";
            } else if (indiceEmisor == -1 && chatsAsignados.length < 5) {
                // Si el emisor no tiene una pestaña asignada y hay menos de 5 pestañas abiertas, asignar una nueva pestaña al emisor
                chatsAsignados.push(emisor);

                console.log(chatsAsignados);

                let indiceNuevoEmisor = chatsAsignados.indexOf(emisor);

                let pestaña = document.querySelector("#pestaña-" + indiceNuevoEmisor);
                pestaña.innerHTML = nombreCompleto + "<br>";

                let chat = document.querySelector("#chat-" + indiceNuevoEmisor);
                chat.innerHTML += nombreCompleto + ": " + respuesta.text + "<br>";
            }

            // Llamar recursivamente a la función recibirMensaje para recibir nuevos mensajes
            recibirMensaje();
        }
    }
}

// Función para enviar un mensaje
function enviarMensaje() {
    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");
    let receptor = document.getElementById("listaAmigos").value;
    let sms = document.getElementById("sms").value;

    // Abrir una solicitud POST al servidor para enviar un mensaje
    http.open("POST", "http://localhost:3001/LenguajeMarcas/Xat", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("mail=" + mail + "&session=" + codigoSesion + "&receptor=" + receptor + "&sms=" + sms);

    let nombre = mail.split("@");
    let primeraLetra = nombre[0].charAt(0).toUpperCase();
    let restoDelNombre = nombre[0].slice(1);
    let nombreCompleto = primeraLetra + restoDelNombre;

    if (!chatsAsignados.includes(receptor) && chatsAsignados.length < 5) {
        // Si el receptor no tiene una pestaña asignada y hay menos de 5 pestañas abiertas, asignar una nueva pestaña al receptor
        chatsAsignados.push(receptor);
    } else if (!chatsAsignados.includes(receptor) && chatsAsignados.length >= 5) {
        // Si el receptor no tiene una pestaña asignada y ya hay 5 pestañas abiertas, mostrar una alerta
        alert("Solo puedes tener 5 conversaciones a la vez");
    }

    console.log(chatsAsignados);

    let nombreReceptor = receptor.split("@");
    let primeraLetraReceptor = nombreReceptor[0].charAt(0).toUpperCase();
    let restoDelNombreReceptor = nombreReceptor[0].slice(1);
    let nombreCompletoReceptor = primeraLetraReceptor + restoDelNombreReceptor;

    let posicionReceptor = chatsAsignados.indexOf(receptor);

    let pestaña = document.querySelector("#pestaña-" + posicionReceptor);
    pestaña.innerHTML = nombreCompletoReceptor + "<br>";

    let chat = document.querySelector("#chat-" + posicionReceptor);
    chat.innerHTML += nombreCompleto + ": " + sms + "<br>";
}

// Función para crear el título de bienvenida
function crearTitulo() {
    let mail = sessionStorage.getItem("mail");
    let nombre = mail.split("@");

    let primeraLetra = nombre[0].charAt(0).toUpperCase();
    let restoDelNombre = nombre[0].slice(1);
    let nombreCompleto = primeraLetra + restoDelNombre;

    document.querySelector("#titulo").innerHTML = "Bienvenido " + nombreCompleto;
}

// Función para limpiar el campo de entrada de texto
function limpiarInput() {
    document.getElementById("sms").value = "";
}

// Función para seleccionar una pestaña
function seleccionarPestaña(index) {
    // Bucle para seleccionar la pestaña activa y desactivar las demás
    let pestañas = document.getElementsByClassName("pestaña");

    for (let i = 0; i < pestañas.length; i++) {
        if (i === index) {
            pestañas[i].classList.add("selected");
        } else {
            pestañas[i].classList.remove("selected");
        }
    }

    // Bucle para mostrar el contenido del chat activo y ocultar los demás
    let chats = document.getElementsByClassName("chat");

    for (let j = 0; j < chats.length; j++) {
        if (j === index) {
            chats[j].classList.add("active");
        } else {
            chats[j].classList.remove("active");
        }
    }
}