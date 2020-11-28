const { default: Login } = require("../components/auth/login")


export async function AuthLogin(username, password) {
    const response = await fetch(`/api/user/login`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(res => res.json())
        .then(result => {
            return result;
        })

    return response;
}

export async function GetUser() {
    const response = await fetch(`/api/user/getUser`)
    return response.json();
}