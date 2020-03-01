function desplegar() {
    document.getElementById("listdrop").classList.toggle("show");
}

window.onclick = function(e) {
    if (!e.target.matches(".dropbtn")) {
        var myDropdown = document.getElementById("listdrop");
        if (myDropdown.classList.contains("show")) {
            myDropdown.classList.remove("show");
        }
    }
}

function getSearchResults(search) {
    const found = fetch('https://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + "25H5H5C2CspWxK0tN831w1bFUwNcNk8u")
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data.data[3].id);
            return data;
        })
        .catch(error => {
            return error;
        });
    return found;
}

getSearchResults("gatitos");