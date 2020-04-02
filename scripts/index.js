const api_key = "25H5H5C2CspWxK0tN831w1bFUwNcNk8u";
const endp_search = "https://api.giphy.com/v1/gifs/search?q=";
const endp_trend = "https://api.giphy.com/v1/gifs/trending?";
const endp_rand = "https://api.giphy.com/v1/gifs/random?";
const limit_get = "&limit=" + 12;
const number_suggest = 4;
const number_trending = 8;

incializar();

function incializar() {
    var result = getSearch("up");

    buildFrame('prompt-container', number_suggest-1);
    buildFrame('trending-container', number_trending-1);

    insertGifs("img-sug", "sug-title", result);
    insertGifs("img-trend", "trend-title", result);
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

/* Cambia el tema segun el number "tema" 1(day) o 2(night) */
function changeTheme(tema) {
    switch(tema) {
        case 1:
            document.getElementById("temas").href = "./styles/temas/day.css";
            document.getElementById("img-down").src = "./images/dropdown.svg";
            break;
        case 2:
            document.getElementById("temas").href = "./styles/temas/night.css";
            document.getElementById("img-down").src = "./images/dropdown-night.svg";
            break;    
    }
}

/* GET al endpoint de busqueda "search"=string a buscar
   Devuelve una promesa de un array de {title,gif} */
function getSearch(search) {
    const found = fetch( endp_search + search + '&api_key=' + api_key + limit_get)
        .then(response => {
            return response.json();
        })
        .then(data => {
            /* console.log(data); */
            var datos = [];
            for(i = 0; i < data.data.length; i++){
                datos.push({"title": data.data[i].title, "gif": data.data[i].images.original.url});
                /* console.log(datos[i]); */
            }
            return datos;
        })
        .catch(error => {
            return error;
        });
    return found;
}

/* Inserta "count" veces un clon del primer hijo de "content" */
function buildFrame(content, count){
    parent = document.getElementById(content);
    child = parent.children[0];
    for(var i=0; i < count; i++) {
        clon = child.cloneNode(true);
        parent.appendChild(clon);
    }
}

/* Inserta los "gifs" en elementos de clase "contenedor" y
    inserta el titulo de "gifs" en elementos de clase "titulo"
    "gifs"(promise) - "contenedor"(string) - "titulo"(string) */
function insertGifs(contenedor, titulo, gifs){
    var clase_cont = document.getElementsByClassName(contenedor);
    var clase_title = document.getElementsByClassName(titulo);
    gifs.then(dato => {
        for(i = 0; i < clase_cont.length; i++) {
            clase_cont[i].src = dato[i].gif;
            clase_title[i].innerHTML = "#" + dato[i].title;
        }
    });
}


/* ########     EVENTOS      ######## */

/* Captura evento cuando escriben en la barra de busqueda
    y muestra los botones de sugerencias */
document.getElementById("input-search").addEventListener("input", 
    function(){
        document.getElementById("btn-resultados").style.display = "flex";
    });