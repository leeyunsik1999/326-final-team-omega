/**
 * Function that takes in a DOM element to add the toolbar as a child to.
 * Generates the toolbar, its contents, and adds it to the input element.
 * Input *should* be page-container.
 * @param {DOM} parent should be the page-container to add the toolbar to.
 */
export function load_toolbar(parent){
    // Outermost div for toolbar that contains logo-row, text-row and divider
    const toolbar = document.createElement("div");
    toolbar.id = "toolbar";
    toolbar.classList.add("d-flex", "flex-column");

    append_logo_row(toolbar);
    append_text_row(toolbar);
    append_divider(toolbar);

    /**
     * Prepending as toolbar needs to come before anything else.
     * I won't need to do this when everything is loaded via JS, but as of now,
     * rest of the page is HTML so i need to prepend this.
     */
    parent.prepend(toolbar);
}

// Below functions are separated for convenience and readability's sake

/**
 * Function that does the logic for logo-row containing filler, logo and login.
 * @param {DOM} toolbar should be the toolbar DOM element.
 */
function append_logo_row(toolbar){

    // Creating logo row to add contents to
    const logo_row = document.createElement("div");
    logo_row.id = "logo-row";
    logo_row.classList.add("row");



    // Creating and appending filler to logo_row
    const filler = document.createElement("div");
    filler.id = "filler";
    filler.classList.add("col");
    logo_row.appendChild(filler);



    // Creating logo div and appending to logo_row
    const logo_toolbar = document.createElement("div");
    logo_toolbar.id = "logo-toolbar";
    logo_toolbar.classList.add("d-flex", "justify-content-center", "col");
    logo_row.appendChild(logo_toolbar);

    // Creating logo button holder and appending logo button to logo_toolbar
    const logo_button = document.createElement("div");
    logo_toolbar.appendChild(logo_button);
    logo_button.id = "toolbar-logo-button";
    logo_button.classList.add("main-button", "d-flex", "justify-content-center", "align-items-center", "flex-column");

    const logo_button_text = document.createElement("div"); // Holder for logo button text
    logo_button_text.id = "logo-text-placeholder";
    logo_button_text.innerText = "LOGO";

    logo_button.appendChild(logo_button_text);



    // Creating login div and appending to logo_row
    const login_toolbar = document.createElement("div");
    login_toolbar.id = "login-toolbar";
    login_toolbar.classList.add("col");
    logo_row.appendChild(login_toolbar);

    // Creating login button and appending to login_toolbar
    // Contains the image for login button, along with its text
    // This is what we should add button functionality of logging out to
    const login_button = document.createElement("div");
    login_button.id = "login-button";
    login_button.classList.add("d-flex", "justify-content-end");
    login_toolbar.appendChild(login_button);

    // Creating avatar container (image) and img itself for login button
    const avatar_container = document.createElement("div");
    avatar_container.id = "avatar-container";
    login_button.appendChild(avatar_container);

    const avatar = document.createElement("img");
    avatar.id = "avatar-image";
    // This is what we should alter in other places if we ever support custom avatar images
    avatar.src = "./images/login_avatar.png";
    avatar_container.appendChild(avatar);

    // Creating and appending login-text and login-buffer to login-button
    // login-text is what we should alter for name updates on button after login
    const login_text = document.createElement("div");
    login_text.id = "login-text";
    login_text.innerText = "Login";
    login_button.appendChild(login_text);

    const login_buffer = document.createElement("div");
    login_buffer.id = "login-buffer";
    login_button.appendChild(login_buffer);

    // Appending logo row to toolbar
    toolbar.appendChild(logo_row);
}

/**
 * Function that does the logic for text-row containing buttons to navigate to Habit, Pictures and Add.
 * @param {DOM} toolbar should be the toolbar DOM element.
 */
function append_text_row(toolbar){
    /**
     * Helper function to generate DO object for text row content.
     * @param {String} text String to show on the button
     */
    function helper(text){
        // Div for button itself-- this is what will be clicked
        const toolbar_button = document.createElement("div");
        // Adding id in form of "habits-textbox", etc. as it's fetched for addEventListener
        toolbar_button.id = `${text.toLowerCase()}-textbox`
        toolbar_button.classList.add("d-flex", "justify-content-center", "col");

        // Div for the text of the textbox
        const toolbar_button_text = document.createElement("div");
        toolbar_button_text.classList.add("toolbar-textbox", "text-center");
        toolbar_button_text.innerText = text;

        toolbar_button.appendChild(toolbar_button_text);
        return toolbar_button;
    }
    // Creating text row to add buttons to
    const text_row = document.createElement("div");
    text_row.id = "text-row";
    text_row.classList.add("row");

    // Appending individual buttons to the row
    text_row.appendChild(helper("Habits"));
    text_row.appendChild(helper("Pictures"));
    text_row.appendChild(helper("Add"));

    // Appending the text row to toolbar
    toolbar.appendChild(text_row);
}

/**
 * Function that does the logic for adding divider.
 * @param {DOM} toolbar should be the toolbar DOM element.
 */
function append_divider(toolbar){
    const divider = document.createElement("div");
    divider.id = "toolbar-divider";
    divider.classList.add("align-self-center");

    toolbar.appendChild(divider);
}