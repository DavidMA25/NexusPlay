export async function apiComunication(method, endpoint, token, bodyText = "", headersText = "") {

    const BASE_URL = "http://localhost/nexusplay/backend/public/api";

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    // token auth
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    // headers extra
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

    // document.getElementById("response").textContent = "Loading...";

    try {
        const res = await fetch(url, {
            method,
            headers,
            body
        });

        const text = await res.text();

        // document.getElementById("response").textContent =
        //     `STATUS: ${res.status}\n\n` + formatted;
        return JSON.parse(text);

    } catch (err) {
        document.getElementById("response").textContent =
            "ERROR:\n" + err;
    }
}