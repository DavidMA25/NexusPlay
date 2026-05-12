// Simple standard API helper for executing manual raw AJAX requests with authorization
export async function apiComunication(method, endpoint, token, bodyText = "", headersText = "") {

    const BASE_URL = "http://localhost/nexusplay/backend/public/api";

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    try {
        const extraHeaders = JSON.parse(headersText || "{}");
        headers = { ...headers, ...extraHeaders };
    } catch (e) {
        alert("Headers JSON inválido");
        return;
    }

    let body = null;

    if (method !== "GET" && method !== "DELETE") {
        try {
            body = bodyText ? JSON.stringify(JSON.parse(bodyText)) : null;
        } catch (e) {
            alert("Body JSON inválido");
            return;
        }
    }

    const url = BASE_URL + endpoint;

    try {
        const res = await fetch(url, {
            method,
            headers,
            body
        });

        const text = await res.text();

        return JSON.parse(text);

    } catch (err) {
        document.getElementById("response").textContent =
            "ERROR:\n" + err;
    }
}