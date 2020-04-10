const api_key = "25H5H5C2CspWxK0tN831w1bFUwNcNk8u";
const endp_search = "https://api.giphy.com/v1/gifs/search?q=";
const endp_trend = "https://api.giphy.com/v1/gifs/trending?";
const endp_rand = "https://api.giphy.com/v1/gifs/random?";
const limit_get = 12;
const number_suggest = 4;
const number_trending = 8;
var session = window.sessionStorage;
var quality = "fixed_height_small";    /* "fixed_height_small" "original" */

incializar();


function incializar() {
    var result = getTrending();

    checkTheme();
    buildFrame('prompt-container', number_suggest);
    buildFrame('trending-container', number_trending);
    insertGifs("img-trend", "trend-title", result);
    sugeridos();
    buquedaSugerida();
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


/* Cambia el tema segun el number "tema" 1(day) o 2(night) y actualiza session */
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


/*  Chequea clave "theme_value" en session.
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


/* GET al endpoint de busqueda "search"=string a buscar
   Devuelve una promesa de un array de {title,gif} */
function getSearch(search) {
    const found = fetch( endp_search + search + "&api_key=" + api_key + "&limit=" + limit_get)
        .then(response => {
            return response.json();
        })
        .then(data => {
            /* console.log(data); */
            var datos = [];
            for(i = 0; i < data.data.length; i++){
                datos.push({"title": data.data[i].title, "gif": data.data[i].images.fixed_height_small.url});
                /* console.log(datos[i]); */
            }
            return datos;
        })
        .catch(error => {
            return error;
        });
    return found;
}


/* GET al endpoint Trending
   Devuelve una promesa de un array de {title,gif} */
function getTrending() {
    const found = fetch( endp_trend + "&api_key=" + api_key + "&limit=" + number_trending)
        .then(response => {
            return response.json();
        })
        .then(data => {
            var datos = [];
            for(i = 0; i < data.data.length; i++){
                datos.push({"title": data.data[i].title, "gif": data.data[i].images.fixed_height_small.url});
            }
            return datos;
        })
        .catch(error => {
            return error;
        });
    return found;
}


/* GET al endpoint de Tendencias de busqueda
   Devuelve una promesa de un array de strings */
function getTrendSearch() {
    const found = fetch("https://api.giphy.com/v1/trending/searches?" + "&api_key=" + api_key)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.data;
        })
        .catch(error => {
            return error;
        });
    return found;
}


/*  GET para obtener un gif de forma random*/
function getRandom() {
    const found = fetch(endp_rand + "&api_key=" + api_key)
        .then(response => {
            return response.json();
        })
        .then(data => {
            var datos = [];
            datos.push({"title": data.data.title, "gif": data.data.images.fixed_height_small.url});
            return datos;
        })
        .catch(error => {
            return error;
        });
    return found;
}


/*  Funcion para traer los gifs de la seccion Sugeridos */
function sugeridos() {
    var clase_img = document.getElementsByClassName("img-sug");
    var clase_title = document.getElementsByClassName("sug-title");
    var clase_btn = document.getElementsByClassName("btn-ver");
    
    for(i = 0; i < number_suggest; i++) {
        var img = clase_img[i];
        var title = clase_title[i];
        var btn = clase_btn[i];
        var res = getRandom();

        insertOneGif(img, title, btn, res);
    }
}


/*  Funcion que se ejecuta en la barra de busqueda
    Inserta los gifs en Tendencias y cambia el titulo */
function buscar(search) {
    var result;
    var title;
    document.getElementById("btn-resultados").style.display = "none";
    if(search == ""){
        let input = document.getElementById("input-search");
        result = getSearch(input.value);
        title = input.value;
    } else {
        console.log("BUSCO search");
        result = getSearch(search);
        title = search;
    }
    console.log(result);
    document.getElementById("title-trend").innerHTML = title;;
    resetGif("img-trend");
    insertGifs("img-trend", "trend-title", result);
}


/*  Busco en la API palabras sugeridas para busquedas y las
    recomiendo en los botones de la barra de busqueda */
function buquedaSugerida(){
    var botones = document.getElementsByClassName("busca-sugerido");
    getTrendSearch()
        .then(array => {
            for(i = 0; i < 3; i++){
                botones[i].innerHTML = "buscar: #" + array[i];
                botones[i].setAttribute("onclick", "buscar('" + array[i] + "')");
            }
        })
        .catch(error => {
            return error;
        });
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


/* Inserta los "gifs" en elementos de clase "img" y
    inserta el titulo de "gifs" en elementos de clase "titulo"
(array)"gifs"[promise]-(string)"img"[class]-(string)"titulo"[class] */
function insertGifs(img, titulo, gifs){
    var clase_cont = document.getElementsByClassName(img);
    var clase_title = document.getElementsByClassName(titulo);
    gifs.then(dato => {
        for(i = 0; i < clase_cont.length; i++) {
            clase_cont[i].src = dato[i].gif;
            clase_title[i].innerHTML = "#" + dato[i].title;
        }
    });
}


/* Inserta un solo gif, en los elementos img, title y btn */
function insertOneGif(img, title, btn, gif) {
    gif.then(d => {
        img.src = d[0].gif;
        title.innerHTML = "#" + d[0].title;
        btn.addEventListener("click", function(){
            buscar(d[0].title);
        });
    });
}


/*  Coloca el gif predeterminado en los contenedores de clase "img"
    mientras carga  */
function resetGif(img) {
    var clase_cont = document.getElementsByClassName(img);
    for(i = 0; i < clase_cont.length; i++) {
        clase_cont[i].src = "../images/cargando.gif";
    }
}


/* ########     EVENTOS      ######## */

/* Captura evento cuando escriben en la barra de busqueda
    y muestra los botones de sugerencias */
document.getElementById("input-search").addEventListener("input", 
    function(){
        document.getElementById("lupa").src = "./images/lupa.svg";
        document.getElementById("btn-search").removeAttribute("disabled");
        document.getElementById("btn-resultados").style.display = "flex";

    });

document.getElementById("input-search").addEventListener("keyup",
    function(){
        if(this.value == ""){
            document.getElementById("lupa").src = "./images/lupa_inactive.svg";
            document.getElementById("btn-search").setAttribute("disabled", true);
            document.getElementById("btn-resultados").style.display = "none";
        }
    });
