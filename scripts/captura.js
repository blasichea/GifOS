const api_key = "25H5H5C2CspWxK0tN831w1bFUwNcNk8u";
const endp_upload = "https://upload.giphy.com/v1/gifs";
const endp_forId = "https://api.giphy.com/v1/gifs/";
var video = document.getElementById("preview");
var recorder;
var url;
var intervalo;
var form = new FormData();
var session = window.sessionStorage;
var event_destroy = new Event("destroy");

incializar();

function incializar() {
    checkTheme();
    initMyGifs();
    initBarraCarga();
}


/* Para mostrar el contenido del dropdown al hacer click en el boton */
function desplegar() {
    document.getElementById("dropdown").style.display = "block";
}

/* Para ocultar dropdown al hacer click fuera de él*/
window.onclick = function(e) {
    if (!e.target.matches(".dropbtn")) {
        var myDropdown = document.getElementById("dropdown");
        if (myDropdown.style.display === "block") {
            myDropdown.style.display = "none";
        }
    }
}


 /* Inicia un stream y lo coloca dentro de "cont"
    Genera un recorder con el stream */
function initCam(cont) {
    /* Inicializo vista */
    document.getElementById("vista").style.display = "none";
    document.getElementById("title-bar").innerHTML = "Un Chequeo Antes de Empezar";
    video.style.display = "block";
    document.getElementById("captura").style.display = "flex";
    /* Inicio camara */
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
        height: { max: 480 }
        }
    })
        .then(stream => {
            console.log(stream);
            cont.srcObject = stream;
            cont.play();
            
            recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 170,
                quality: 10,
                width: 360,
                hidden: 240,
                onGifRecordingStarted: function() {
                console.log('started')
                },
            });
            recorder.camera = stream;
            /* Eventos para botones de captura */
            document.getElementById("btn-captura").addEventListener("click", startRec);
            document.getElementById("btn-stop").addEventListener("click", stopRec);
        })
        .catch(err => {
            console.log("Error Media: " + err);
        });
}


function startRec() {
    recorder.startRecording();
}


function stopRec() {
    recorder.stopRecording(function(){
        var blob = recorder.getBlob();
        var gifUrl = URL.createObjectURL(blob);
        /* Modifico DOM */
        video.style.display = "none";
        document.getElementById("vista").style.display = "block";
        document.getElementById("vista").src = gifUrl;                    
        document.getElementById("gif-result").src = gifUrl;
        /* Form + UP + destroy */
        form.append("file", blob, "myGif.gif");
        document.getElementById("btn-subir").addEventListener("click", subirGif);
    });
}

function subirGif() {
    gifUpload(form);
    destroyRec();
}


function destroyRec() {
    recorder.camera.stop();
    recorder.destroy();
    recorder = null;
}


/*  STOP objeto que reproducia el stream */
function stopCam(cont) {
    cont.stop;
    cont.srcObject = null;
}


/*  upload del gif a Giphy */
function gifUpload(fdata){
    fetch(endp_upload + "?api_key=" + api_key, {
        method: "POST",
        body: fdata
    })
        .then(response => {
            return response.json();
        })
        .then(res => {
            gifId = res.data.id;
            fetch(endp_forId + gifId + "?api_key=" + api_key)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    var mygifs = localStorage.getItem("mygifs");
                    var item = [];
                    url = data.data.images.original.url;
                    agregoMiGif();
                    if(mygifs){
                        item = JSON.parse(mygifs);
                        item.push(url);
                        localStorage.setItem("mygifs", JSON.stringify(item));
                    } else {
                        item.push(url);
                        localStorage.setItem("mygifs", JSON.stringify(item));
                    }
                    document.getElementById("grabadora").style.display = "none";
                    document.getElementById("carga").style.display = "none";
                    document.getElementById("resultado").style.display = "block";
                    clearInterval(intervalo);
                })
                .catch(error => {
                    return error;
                });
        })
        .catch(error => {
            return error;
        });
}


/*  Agrega un nuevo gif a "Mis Guifos" con la url*/
function agregoMiGif() {
    var padre = document.getElementById("container");
    var clon = padre.children[0].cloneNode(true);

    padre.appendChild(clon);
    clon.style.display = "flex";
    clon.getElementsByClassName('my-img')[0].src = url;
}


/*  Agregar un gif en "mis guifos" */
function initMyGifs(){
    var mygifs = JSON.parse(localStorage.getItem("mygifs"));

    if(mygifs){
        var img = document.getElementsByClassName("my-img");
        var padre = document.getElementById("container");
        buildFrame("container", mygifs.length);
        for(i = 0; i < mygifs.length; i++) {
            padre.children[i].style.display = "flex";
            img[i].src = mygifs[i];
        }
    }
}


/* Inserta "count-1" veces un clon del primer hijo de "content" */
function buildFrame(content, count){
    parent = document.getElementById(content);
    child = parent.children[0];
    for(var i=1; i < count; i++) {
        clon = child.cloneNode(true);
        parent.appendChild(clon);
    }
}


/*  Las siguientes funciones son para:
    Cambios en el DOM al presionar botones */

function cancel() {
    document.getElementById("capturar").style.display = "none";
}


function startVideo() {
    document.getElementById("capturar").style.display = "none";
    document.getElementById("grabadora").style.display = "flex";
    initCam(video);
}


function recordVideo() {
    document.getElementById("captura").style.display = "none";
    document.getElementById("listo").style.display = "flex";
    document.getElementById("title-bar").innerHTML = "Capturando Tu Guifo";
}


function listo() {
    document.getElementById("listo").style.display = "none";
    document.getElementById("subir").style.display = "flex";
    document.getElementById("title-bar").innerHTML = "Vista Previa";
    stopCam(video);
}


function subir() {
    document.getElementById("subir").style.display = "none";
    document.getElementById("subiendo").style.display = "flex";
    document.getElementById("vista").style.display = "none";
    document.getElementById("carga").style.display = "flex";
    document.getElementById("title-bar").innerHTML = "Subiendo Guifo";
    animationBar();
}


function repetir() {
    document.getElementById("subir").style.display = "none";
    document.getElementById("captura").style.display = "flex";
    destroyRec();
    initCam(video);
}


function cancelar() {
    document.getElementById("subiendo").style.display = "none";
    document.getElementById("grabadora").style.display = "none";
    document.getElementById("carga").style.display = "none";
    document.getElementById("capturar").style.display = "flex";
    clearInterval(intervalo);
}


function finalizar() {
    document.getElementById("resultado").style.display = "none";
    document.getElementById("subiendo").style.display = "none";
    document.getElementById("capturar").style.display = "flex";
}


function cerrar() {
    document.getElementById("grabadora").style.display = "none";
    document.getElementById("capturar").style.display = "flex";
    clearInterval(intervalo);
}


/*  Inicializar barra de carga */
function initBarraCarga() {
    var barra = document.getElementById("barra-upload");

    for(i = 1; i < 23; i++) {
        let clon = barra.children[0].cloneNode(true);
        barra.appendChild(clon);
    }
}


/*  Animar barra de carga */
function animationBar() {
    var cuadritos = document.getElementsByClassName("cuadrito");
    var index_front = 0;
    var index_back = 0;

    intervalo = setInterval(avance, 50);
    function avance() {
        cuadritos[index_front].style.background = "#F7C9F3";
        if(index_front < 22) {
            index_front++;   
        }
        if(index_front > 6) {
            cuadritos[index_back].style.background = "#999999";
            index_back++;
            if(index_back == 23) {
                index_back = 0;
                index_front = 0;
            }
        }
    }
}


/*  Copia URL de gif al clipboard */
function copyUrl() {
    const elem = document.createElement('input');
    elem.value = url;
    elem.style.left = "-9999px";
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    alert("Se copió: " + elem.value);
    document.body.removeChild(elem);
}


/*  Download gif */
function downloadGif(){
    var link = document.createElement("a");
    link.download = "miGuifo";
    link.target = "_blank";
    link.href = document.getElementById("gif-result").src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}


/* Cambia el tema segun el number "tema" 1(day) o 2(night) */
function changeTheme(tema) {
    switch(tema) {
        case "1":
            document.getElementById("temas").href = "./styles/temas/day.css";
            document.getElementById("img-down").src = "./images/dropdown.svg";
            session.setItem("theme_value","1");
            break;
        case "2":
            document.getElementById("temas").href = "./styles/temas/night.css";
            document.getElementById("img-down").src = "./images/dropdown-night.svg";
            session.setItem("theme_value","2");
            break;    
    }
}


/*  Chequea clave "theme_value" en sessionStorage.
    Si existe aplica changeTheme()
    De lo contrario, set en "1" theme por defecto */
function checkTheme() {
    var theme_value = session.getItem("theme_value");
    if (theme_value) {
        changeTheme(theme_value);
    } else {
        session.setItem("theme_value","1");
    }
}