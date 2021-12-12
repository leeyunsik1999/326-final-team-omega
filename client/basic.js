import { load_toolbar } from './page_loaders/toolbar.js';
import { load_main_page } from './page_loaders/main_page.js';
import { load_daily_page } from './page_loaders/daily_habits_page.js';
import { load_monthly_page } from './page_loaders/monthly_habits_page.js';
import { loadImagesPage } from './page_loaders/loadImages.js';
import { loadAddPage } from './page_loaders/addPage.js';

// Setting hostname to use for API calls
window.requestName = window.location.hostname === 'localhost' ? 'http://localhost:8080' : `https://${window.location.hostname}`;

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

async function initialize() {

    window.user_name = document.URL.split('/')[4];
    console.log(window.user_name);

    const page_container = document.getElementById("page-container");

    const page = document.getElementById("page-content");
    // Loading pages via JS
    load_toolbar(page_container);

    load_main_page(page);

    await load_daily_page(page);

    await load_monthly_page(page);
    await loadImagesPage(page);
    loadAddPage(page);

    // Adding functionality to logo button going back to main page
    document.getElementById("toolbar-logo-button").addEventListener("click", () => load_page("main-page"));

    // Adding logout functionality to logout button
    document.getElementById("login-button").addEventListener("click", () => {
        fetch(`${window.requestName}/logout`).then(res => {
            if (res.redirected) {
                window.location.href = res.url;
            }
        });
    })

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

    while (document.getElementById("daily-page-button") === null || document.getElementById("monthly-page-button") === null){
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    // Adding functionality to monthly view button on habits page
    document.getElementById("daily-page-button").addEventListener("click", () => load_page("habits-page"));
    document.getElementById("monthly-page-button").addEventListener("click", () => load_page("monthly-habits-page"));
    
    load_page("main-page");
}

await (async () => {
    // Setting hostname to use for API calls
    window.requestName = window.location.hostname === 'localhost' ? 'http://localhost:8080' : `https://${window.location.hostname}`;
    console.log(window.requestName);
    initialize();
})();
