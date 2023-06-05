let i = 1;
var idContacto;
var idConversacion;
var contactoSeleccionado = null;
function enviarLogin() {
    let http = new XMLHttpRequest();
    let mail = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;

    http.open("GET", "http://localhost:3001/LenguajeMarcas/Login?mail="+mail+"&pass="+pass,true);
    http.send();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let session = this.responseText;
            if (session != "false") {
                window.sessionStorage.setItem("mail", mail);
                window.sessionStorage.setItem("pass", pass);
                window.sessionStorage.setItem("session", session);
                setTimeout(function() {
                    avanzarChat();
                }, 700);
            } else {
                document.querySelector(".result").innerHTML = "Login incorrecto";
            }
        }
    }
}

function avanzarChat(){
    var codigoSesion =sessionStorage.getItem("session");
    if (codigoSesion != 0) {
        // Redirigir a la página de Gestión
        window.location.href = "chat.html";
    }
}
function getPaises() {
    let http = new XMLHttpRequest();

    http.open("GET", "http://localhost:3001/LenguajeMarcas/Register", true);
    http.send();

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jsonString = http.responseText;
            let listaPaíses = JSON.parse(jsonString);
            console.log(listaPaíses);
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

function enviarRegistro() {
    var http = new XMLHttpRequest();

    let user = document.getElementById("user").value;
    let mail = document.getElementById("mail").value;
    let pais = document.getElementById("pais").value;
    let pass = document.getElementById("pass").value;
    let repeatpass = document.getElementById("repeatpass").value;

    if (pass === repeatpass) { 
        http.open("POST", "http://localhost:3001/LenguajeMarcas/Register", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("user="+user+"&mail="+mail+"&pais="+pais+"&pass="+pass);

        http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let resultElement = document.getElementById("result");
                console.log("Registro completado: " + http.responseText);
                resultElement.innerHTML = "Te has registrado correctamente,ya puedes iniciar sesión";
                resultElement.style.color = "#00FF00";
            }
        }
    } else {
        document.getElementById("respuesta").innerHTML = "<p style='color:red'>No coinciden las contraseñas </p>"
    }
}





function cargarContactos(emailAmigo) {
    let divContactos = document.querySelector(".contenedor-amigos");
    let contenedorPrincipal = document.querySelector(".contenedor-principal");
    

    let divAmigo = document.createElement("div");
    let conversacion = document.createElement("div");
    
    // Asigna clases
    divAmigo.classList.add("div-amigo");
    conversacion.classList.add("conversacion");

    // Crea divs únicos usando "i" para iterar
    divAmigo.id = "contacto-" + i;
    divAmigo.textContent = emailAmigo;
    conversacion.id = "conversacion-" + i;
    conversacion.style.display = "none";

    // Agrega divs dentro de "conversacion"

    divAmigo.addEventListener("click", function () {
        idContacto = this.id;
        idConversacion = idContacto.replace("contacto", "conversacion");
        
        mostrarConversacion();
    });

    i++;
    

    // Anade los divs a sus respectivos divs padres

    divContactos.appendChild(divAmigo);
    contenedorPrincipal.appendChild(conversacion);
}

function mostrarConversacion()  {
    // Guarda los id de "contacto" y "conversacion" en variables
    // Usamos "target.getAttribute" porque el id no es fijo, ya que va iterando la i.
    // Está conectando la conversacion al contacto ya que el número de ínidice es el mismo para los dos.
    let conversacion = document.getElementById(idConversacion);


    // Guarda el color del fondo principal para copiarlo en el contacto
    let colorChat = window.getComputedStyle(document.querySelector(".contenedor-principal")).backgroundColor;
    let contacto = document.getElementById(idContacto);


    /// Restablece las propiedades cuando se selecciona otro contacto
    if (contactoSeleccionado) {
        contactoSeleccionado.style.color = "";
        contactoSeleccionado.style.backgroundColor = "";
    }
    
    // Cambia el color del contacto seleccionado
    contacto.style.color = "#1e1e1e";
    contacto.style.backgroundColor = "#ffc91d";

    // Oculta todos los divs de conversación
    let listaConversaciones = document.querySelectorAll(".conversacion");
    for (let conver of listaConversaciones) {
        conver.style.display = "none";
    }

    // Muestra el div de conversación del contacto seleccionado
    conversacion.style.display = "flex";


    contactoSeleccionado = contacto;
}

function anadirAmigo() {
    let http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");
    let friend = document.getElementById("friend").value;

    http.open("POST", "http://localhost:3001/LenguajeMarcas/Friend", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("mail="+mail+"&session="+session+"&friend="+friend);
    
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

function getFriends() {
    let http = new XMLHttpRequest();
    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");
    http.open("GET", "http://localhost:3001/LenguajeMarcas/Friend?mail="+mail+"&session="+session,true);
    http.send();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let jsonAmigos = JSON.parse(http.responseText);
            
            for (let i = 0; i < jsonAmigos.length; i++){
                let persona = jsonAmigos[i];
                cargarContactos(persona, i);
            }
            
        }
    }
}

var chatsAsignados = [];

function añadirAmigo() {

    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");
    let friend = document.getElementById("friend").value;

    http.open("POST", "http://localhost:3001/LenguajeMarcas/Friend", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("mail=" + mail + "&session=" + codigoSesion + "&friend=" + friend);

    http.onreadystatechange = function(){

        let respuesta = http.responseText;

        if (http.readyState == 4 && http.status == 200) {

            if (respuesta == "0") {

                document.getElementById("resultado").innerHTML = "El servidor no responde";
                document.getElementById("resultado").style.color = "red";

            } else if (respuesta == "1") {

                document.getElementById("resultado").innerHTML = "Amigo añadido con éxito";
                document.getElementById("resultado").style.color = "green";
                recibirAmigos();

            } else if(respuesta == "2") {

                document.getElementById("resultado").innerHTML = "Amigo no encontrado";
                document.getElementById("resultado").style.color = "red";

            } else {

                document.getElementById("resultado").innerHTML = "Usuario necesita Login";
                document.getElementById("resultado").style.color = "red";
            }
        }
    }
}


function recibirAmigos() {

    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");

    http.open("GET", "http://localhost:3001/LenguajeMarcas/Friend?mail="+mail+"&session="+codigoSesion, true);
    http.send();

    http.onreadystatechange = function(){

        if (http.readyState == 4 && http.status == 200) {

            let jsonString = http.responseText;
            let arrayAmigos = JSON.parse(jsonString);
            let selectElement = document.getElementById("listaAmigos");

            for (let i in arrayAmigos) {

                let amigo = arrayAmigos[i];
                let option = document.createElement("option");
                option.text = amigo;
                selectElement.add(option);

            }
        }
    }
}

function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "inicioSesion.html";
}

function recibirMensaje() {

    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");

    http.open("GET", "http://localhost:3001/LenguajeMarcas/Xat?mail="+mail+"&session="+codigoSesion, true);
    http.send();

    http.onreadystatechange = function(){

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

                let pestaña = document.querySelector("#pestaña-" + indiceEmisor);
                pestaña.innerHTML = nombreCompleto + "<br>";

                let chat = document.querySelector("#chat-" + indiceEmisor);
                chat.innerHTML += nombreCompleto + ": " + respuesta.text + "<br>";

            } else if (indiceEmisor == -1 && chatsAsignados.length < 5) {

                chatsAsignados.push(emisor);

                console.log(chatsAsignados);

                let indiceNuevoEmisor = chatsAsignados.indexOf(emisor);

                let pestaña = document.querySelector("#pestaña-" + indiceNuevoEmisor);
                pestaña.innerHTML = nombreCompleto + "<br>";

                let chat = document.querySelector("#chat-" + indiceNuevoEmisor);
                chat.innerHTML += nombreCompleto + ": " + respuesta.text + "<br>";
            } 

            recibirMensaje();
        }
    }
}

function enviarMensaje() {

    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");
    let receptor = document.getElementById("listaAmigos").value;
    let sms = document.getElementById("sms").value;

    http.open("POST", "http://localhost:3001/LenguajeMarcas/Xat", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("mail=" + mail + "&session=" + codigoSesion + "&receptor=" + receptor + "&sms=" + sms);

    let nombre = mail.split("@");
    let primeraLetra = nombre[0].charAt(0).toUpperCase();
    let restoDelNombre = nombre[0].slice(1);
    let nombreCompleto = primeraLetra + restoDelNombre;

    if (!chatsAsignados.includes(receptor) && chatsAsignados.length < 5) {
        
        chatsAsignados.push(receptor);

    } else if (!chatsAsignados.includes(receptor) && chatsAsignados.length >= 5) {

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

function crearTitulo() {
    let mail = sessionStorage.getItem("mail");
    let nombre = mail.split("@");

    let primeraLetra = nombre[0].charAt(0).toUpperCase();
    let restoDelNombre = nombre[0].slice(1);
    let nombreCompleto = primeraLetra + restoDelNombre;
    
    document.querySelector("#titulo").innerHTML = "Bienvenido " + nombreCompleto;
}

function limpiarInput() {
    document.getElementById("sms").value = "";
}

function seleccionartPestaña(index) {

    // Bucle para seleccionar la pestaña
    let pestaña = document.getElementsByClassName("pestaña");

    for (let i = 0; i < pestaña.length; i++) {
        if (i === index) {
            pestaña[i].classList.add("selected");
        } else {
            pestaña[i].classList.remove("selected");
        }
        }

        // Bucle para mostrar el contenido de cada chat
        let chat = document.getElementsByClassName("chat");

        for (let j = 0; j < chat.length; j++) {
        if (j === index) {
            chat[j].classList.add("active");
        } else {
            chat[j].classList.remove("active");
        }
        }
}