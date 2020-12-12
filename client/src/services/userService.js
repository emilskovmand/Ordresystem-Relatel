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


export async function GetUserList() {
    const response = await fetch(`/api/user/userlist`);
    return response.json();
}

export async function UpdateUser(dbId, username, password, email, admin, createOrder, produceOrder, approve, completedOrders) {
    const response = await fetch(`/api/user/update`, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dbId: dbId,
            username: username,
            password: password,
            email: email,
            admin: admin,
            createOrder: createOrder,
            produceOrder: produceOrder,
            approve: approve,
            completedOrders: completedOrders
        })
    })
}

export async function CreateUser(username, password, email, admin, createOrder, produceOrder, approve, completedOrders) {
    const response = await fetch(`/api/user/register`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            admin: admin,
            createOrder: createOrder,
            produceOrder: produceOrder,
            approve: approve,
            completedOrders: completedOrders
        })
    })
}