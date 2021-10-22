'use strict';
import * as toolbarUtils from './toolbar_loader.js';

function load_main(){
    console.log("main page loaded");
    // Loading in main page's toolbar
    toolbarUtils.load_main_toolbar();
    // Adding listener to logo so that when it's clicked, it loads the main page
    document.getElementById("logo_image").addEventListener("click", load_main);
}

/**
 * Initializes containers that will persist throughout all usages of website.
 * Calls load_main() at the end to go to homepage.
 */
function initialize(){
    // Initializing and adding classes to the lowermost container that contains the whole page
    const page = document.getElementById("page-container");
    page.classList.add("d-flex");
    page.classList.add("flex-column");

    // Setting up toolbar that will contain logo, page navigation tools and login
    const toolbar = document.createElement("div");
    toolbar.id = "toolbar";
    toolbar.classList.add("container");

    page.appendChild(toolbar);

    // Testing
    toolbar.style.backgroundColor = 'green';

    // Setting up page content that will contain all pages for all uses
    const page_content = document.createElement("div");
    page_content.id = "page-content";

    page.appendChild(page_content);

    // Testing
    page_content.style.backgroundColor = 'red';

    load_main();
}

initialize();