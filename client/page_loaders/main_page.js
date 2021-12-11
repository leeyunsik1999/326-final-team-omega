/**
 * Function that takes in a DOM element to add the main page as a child to.
 * Generates the main page along with its buttons.
 * Input *should* be page-content.
 * @param {DOM} parent should be the page-content to add the page to.
 */
export function load_main_page(parent){
    // Outermost div that is the main page
    const main_page = document.createElement("div");
    main_page.id = "main-page";
    main_page.classList.add("page");

    // Appending main page to page holder
    parent.appendChild(main_page);

    // Generating and appending main and sub buttons to main page
    main_row(main_page);
    sub_row(main_page);
}

/**
 * Function that generates and appends the main buttons to the main page.
 * @param {DOM} page DOM element of the main page.
 */
function main_row(page){
    // Row for buttons to be located in.
    const main_button_row = document.createElement("div");
    main_button_row.id = "main-button-row";
    main_button_row.classList.add("d-flex", "justify-content-center");

    /**
     * Helper function that creates main button based off input text.
     * @param {String} text text that defines the button. 
     * @returns {DOM} button DOM element
     */
    function main_button_creator(text){
        // Holder for the text and image of button
        const button = document.createElement("div");
        button.id = `${text}-page-main-button`;
        button.classList.add("main-button", "d-flex", "justify-content-center", "align-items-center", "flex-column");
    
        // Creating text for button and appending to button
        const button_text = document.createElement("div");
        button_text.classList.add("row", "main-button-text");
        button_text.innerText = text;
        button.appendChild(button_text);

        // Creating image for button and appending to button
        const button_logo = document.createElement("img");
        button_logo.id = `${text}-button-logo`;
        button_logo.classList.add("button-image");
        button_logo.src = `/images/${text}_logo.png`;
        button.appendChild(button_logo);
        
        return button;
    }

    // Creating and appending buttons to row
    main_button_row.appendChild(main_button_creator("habits"));
    main_button_row.appendChild(main_button_creator("pictures"));

    page.appendChild(main_button_row);
}

/**
 * Function that generates and appends the sub buttons to the main page.
 * @param {DOM} page DOM element of the main page.
 */
 function sub_row(page){
    // Row for buttons to be located in.
    const sub_button_row = document.createElement("div");
    sub_button_row.id = "sub-button-row";
    sub_button_row.classList.add("d-flex", "justify-content-center");

    /**
     * Helper function that creates sub button based off input text.
     * @param {String} text text that defines the button. 
     * @returns {DOM} button DOM element
     */
    function sub_button_creator(text){
        // Holder for the text and image of button
        const button = document.createElement("div");
        button.id = `${text}-page-sub-button`;
        button.classList.add("sub-button", "d-flex", "justify-content-center", "align-items-center");

        // Creating image for button and appending to button
        const button_logo = document.createElement("img");
        button_logo.id = `${text}-button-logo`;
        button_logo.classList.add("button-image");
        button_logo.src = `/images/${text}_logo.png`;
        button.appendChild(button_logo);
        
        return button;
    }

    // Creating and appending buttons to row
    sub_button_row.appendChild(sub_button_creator("theme"));
    sub_button_row.appendChild(sub_button_creator("add"));
    sub_button_row.appendChild(sub_button_creator("setting"));

    page.appendChild(sub_button_row);
}