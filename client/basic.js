import { load_toolbar } from './page_loaders/toolbar.js';
import { load_main_page } from './page_loaders/main_page.js';
import { load_login_card } from './page_loaders/login.js';

/**
 * Takes in the page id of page-content's child to show. Hides all other children of page-content.
 * Used as a really bad solution for page switching through buttons.
 * Temporary solution until all pages are loaded via DOM-surgery in JS
 * @param {string} page_id the DOM object's id to load. Child of page-content
 */
function load_page(page_id) {
    const pages = [
        "main-page",
        "habits-page",
        "pictures-page",
        "add-page",
        "monthly-habits-page"
    ];

    for (const page of pages) {
        document.getElementById(page).style.display = page === page_id ? "block" : "none";
        
        // Once all pages are loaded by JS, toggle them at the end of generation so we can use this to switch visibility instead
        //document.getElementById(page).classList.toggle("visible");
    }
}

function initialize() {
    //TEMPORARILY MIMICING WHAT A LOGIN WOULD DO
    window.user_id = 1;
    window.user_name = "username";

    const page_container = document.getElementById("page-container");

    const page = document.getElementById("page-content");
    // Loading pages via JS
    load_toolbar(page_container);

    load_main_page(page);

    // Adding functionality to logo button going back to main page
    document.getElementById("toolbar-logo-button").addEventListener("click", () => load_page("main-page"));

    // Adding functionality to logo button and toolbar button going to habits page
    document.getElementById("habits-page-main-button").addEventListener("click", () => load_page("habits-page"));
    document.getElementById("habits-textbox").addEventListener("click", () => load_page("habits-page"));
    
    // Adding functionality to logo button and toolbar button going to pictures page
    document.getElementById("pictures-page-main-button").addEventListener("click", () => load_page("pictures-page"));
    document.getElementById("pictures-textbox").addEventListener("click", () => load_page("pictures-page"));
    
    // Adding functionality to logo button and toolbar button going to add page
    document.getElementById("add-page-sub-button").addEventListener("click", () => load_page("add-page"));
    document.getElementById("add-textbox").addEventListener("click", () => load_page("add-page"));

    // Adding functionalty to add buttons on habits page
    document.getElementById("add-habit-sub-button").addEventListener("click", () => load_page("add-page"));
    document.getElementById("add-pic-sub-button").addEventListener("click", () => load_page("add-page"));

    // Adding functionality to monthly view button on habits page
    document.getElementById("monthly-page-button").addEventListener("click", () => load_page("monthly-habits-page"));   
    document.getElementById("daily-page-button").addEventListener("click", () => load_page("habits-page")); 
    
    load_page("main-page");
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

function login(){
    // Saving initialize function so we can call it from login.js without
    // a circular import.
    // It's a really bad way to do it but shrug
    window.init_func = initialize;
    const page = document.getElementById("page-container");
    
    // Saving content to HTML that we can recall later.
    // DO NOT TO THIS ONCE WE HAVE FUNCTIONS TO LOAD PAGES!!!
    window.main_page_content = page.innerHTML;
    page.innerHTML = "";

    load_login_card();
}

login();