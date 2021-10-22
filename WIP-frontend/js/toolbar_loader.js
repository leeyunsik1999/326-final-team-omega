export function load_main_toolbar(){
    const toolbar = document.getElementById("toolbar");
    toolbar.innerHTML = "";

    // Row that will contain the filler div, logo div and login div
    const logo_row = document.createElement("div");
    logo_row.classList.add("row");

    toolbar.appendChild(logo_row);

    // Filler object to maintain a 1/3 - 1/3 - 1/3 space division
    const filler = document.createElement("div");
    filler.id = "filler";
    filler.classList.add("col");
    logo_row.appendChild(filler);

    filler.style.backgroundColor = 'blue';

    // Middle object that will contain the logo image
    const logo = document.createElement("div");
    logo.id = "logo_toolbar";
    logo.classList.add("col");
    //logo.classList.add("toolbar-logo-container");
    logo_row.appendChild(logo);

    // Element that contains the logo itself
    const logo_image = document.createElement("img");
    logo_image.id = "logo_image";
    logo_image.classList.add("toolbar-logo");
    logo_image.setAttribute("src", "./images/sample_logo.png");
    logo_image.setAttribute("height", "96");
    logo_image.setAttribute("width", "96");
    logo_image.setAttribute("alt", "Sample Logo");
    logo.style.backgroundColor = 'yellow';
    logo.appendChild(logo_image);

    // Right object that will contain the login button
    const login = document.createElement("div");
    login.id = "login";
    login.classList.add("col");
    login.classList.add("align-self-end");
    login.innerText = "Login";
    logo_row.appendChild(login);

    login.style.backgroundColor = 'black';

}