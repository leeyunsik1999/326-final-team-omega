//import { URL, URLSearchParams } from 'url';

/**
 * Function that appends the login card to login-container.
 * Generates the login card/page.
 */
export function load_login_card() {
    const parent = document.getElementById("login-container");
    const login_card = document.createElement("div");
    login_card.id = "login-card";
    login_card.classList.add("card", "center-card");
    login_card.appendChild(get_card_body("login"));

    // Refreshing innerHTML in case we are switching from register to login
    parent.innerHTML = "";
    parent.append(login_card);

    // Hiding password when entering
    document.getElementById("password-input").type="password";

    // Adding event listeners to button-- login and switching to register form.
    document.getElementById("btn-primary").addEventListener("click", login_button_event);
    document.getElementById("btn-secondary").addEventListener("click", load_register_card);
}

/**
 * Function that appends the login card to login-container.
 * Generates the register card/page.
 */
function load_register_card() {
    const parent = document.getElementById("login-container");
    const login_card = document.createElement("div");
    login_card.id = "login-card";
    login_card.classList.add("card", "center-card");
    login_card.appendChild(get_card_body("register"));

    // Refreshing innerHTML in case we are switching from register to login
    parent.innerHTML = "";
    parent.append(login_card);

    // Adding functionalities to buttons-- registering and cancel register (go back to login) button.
    document.getElementById("btn-primary").addEventListener("click", register_button_event);
    document.getElementById("btn-secondary").addEventListener("click", load_login_card);
}

/**
 * Function that generates the card body to be appended as a child to login card.
 * Appends automatically. Names differ by if input is for login or register.
 * @param {String} type register or login. Fields change based off that
 */
function get_card_body(type) {

    // Creating card body to append
    const card_body = document.createElement("div");
    card_body.classList.add("card-body");

    // Creating and adding heading
    const heading = document.createElement("h5");
    heading.innerText = type === "login" ? "Login" : "Register";
    card_body.appendChild(heading);

    // Creating and adding label for username
    const user_label = document.createElement("label");
    user_label.setAttribute("for", "username-input");
    user_label.classList.add("form-label");
    user_label.innerText = type === "login" ? "Username" : "New Username";
    card_body.appendChild(user_label);

    // Creating and adding input for username
    const user_input = document.createElement("input");
    user_input.id = "username-input";
    user_input.classList.add("form-control");
    card_body.appendChild(user_input);

    card_body.appendChild(document.createElement("br"));

    // Creating and adding label for password
    const password_label = document.createElement("label");
    password_label.setAttribute("for", "password-input");
    password_label.classList.add("form-label");
    password_label.innerText = type === "login" ? "Password" : "New Password";
    card_body.appendChild(password_label);

    // Creating and adding input for password
    const password_input = document.createElement("input");
    password_input.id = "password-input";
    password_input.classList.add("form-control");
    card_body.appendChild(password_input);

    card_body.appendChild(document.createElement("br"));

    // Creating and adding primary button for login/register
    const btn_primary = document.createElement("button");
    btn_primary.id = "btn-primary";
    btn_primary.classList.add("btn", "btn-primary");
    btn_primary.innerText = type === "login" ? "Login" : "Register";
    card_body.appendChild(btn_primary);

    // Creating and adding secondary button for register/cancel
    const btn_secondary = document.createElement("button");
    btn_secondary.id = "btn-secondary";
    btn_secondary.classList.add("btn", "btn-secondary");
    btn_secondary.innerText = type === "login" ? "Register" : "Cancel";
    card_body.appendChild(btn_secondary);

    return card_body;
}

/**
 * Function run when login is attempted.
 * Sends username/password data from username-input and password-input.
 * If a 200 is accepted, sets window.user_name as username, window.user_id as id returned then proceeds to main page
 * If fail, alert is sent with a message according to the status code received from server.
 * Err 401: Invalid password
 * Err 404: Username not found
 * 
 * When successfully logged in, un-loads login content, then loads main page through initalize().
 */
async function login_button_event() {
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;

    // Checks if both username/password exists.
    if (username.length === 0) {
        alert("Enter a username!");
    } else if (password.length === 0) {
        alert("Enter a password!");
    } else {
        // Requesting login to server
        //const response = await fetch(`${window.requestName}/login?username=${username}&password=${password}`);
        
        // Changed to post request
        const response = await fetch(`${window.requestName}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });

        console.log(response.redirected);
        
        console.log("Post request processing clientside");
        // Processing respons
        if (response.status === 401) {
            alert("Invalid password!");
        } else if (response.status === 404) {
            alert("Invalid username!");
        } else if (response.redirected){
            window.location.href = response.url;
        }
    }
}

/**
 * Function run when register is attempted.
 * Sends username/password to server to see if you can create an account.
 * Err 406: Username or password is too short (0 length chars)
 * Err 409: Username already exists.
 * 
 * Appropriate alert is given for each errors, and success case.
 */
async function register_button_event(){
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;
    // Checks if both username/password exists.
    if (username.length === 0) {
        alert("Enter a username!");
    } else if (password.length === 0) {
        alert("Enter a password!");
    } else {
        // Requesting login to server
        const response = await fetch(`${window.requestName}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });
        // Processing response
        if (response.status === 406) {
            alert("Username or password is too short!");
        } else if (response.status === 409) {
            alert("Username already exists.");
        } else {
            alert("Account created! You can now log in.");
        }
    }
}