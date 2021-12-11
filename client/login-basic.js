import { load_login_card } from './page_loaders/login.js';

// Setting hostname to use for API calls
window.requestName = window.location.hostname === 'localhost' ? 'http://localhost:8080' : `https://${window.location.hostname}`;

function login() {
    load_login_card();
}

await (async () => {
    // Setting hostname to use for API calls
    window.requestName = window.location.hostname === 'localhost' ? 'http://localhost:8080' : `https://${window.location.hostname}`;
    login();
})();