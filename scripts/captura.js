const api_key = "25H5H5C2CspWxK0tN831w1bFUwNcNk8u";
var video = document.getElementById("preview");

incializar();

function incializar() {
    
}

 /* Inicia un stream y lo coloca dentro de "cont" */
function iniciarCam(cont) {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
        height: { max: 480 }
        }
    })
        .then(stream => {
        cont.srcObject = stream;
        cont.play();
        })
        .catch(err => {
            console.log("Error Media: " + err);
        })
}

/*  Las siguientes funciones son para:
    Cambios en el DOM al presionar botones */

function startVideo() {
    document.getElementById("capturar").style.display = "none";
    document.getElementById("grabadora").style.display = "flex";
     /* iniciarCam(video); */
}

function recordVideo() {
    document.getElementById("captura").style.display = "none";
    document.getElementById("listo").style.display = "flex";
}

function listo() {
    document.getElementById("listo").style.display = "none";
    document.getElementById("subir").style.display = "flex";
}

function subir() {
    document.getElementById("subir").style.display = "none";
    document.getElementById("subiendo").style.display = "flex";
}

function repetir() {
    document.getElementById("subir").style.display = "none";
    document.getElementById("captura").style.display = "flex";
    /* iniciarCam(video); */
}

function cerrar() {
    document.getElementById("grabadora").style.display = "none";
    document.getElementById("capturar").style.display = "flex";
}