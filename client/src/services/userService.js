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

export async function UpdateUserRoles(_id, admin, createUser, createOrder, produceOrder, approve, completedOrders) {
    const response = await fetch(`/api/user/updateRoles/${_id}`, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            admin: admin,
            createUser: createUser,
            createOrder: createOrder,
            produceOrder: produceOrder,
            approve: approve,
            completedOrders: completedOrders
        })
    });

    return [response.json(), response.status];
}

export async function UpdateOwnUser(_id, email, password) {
    const response = await fetch(`/api/user/editmyuser/${_id}`, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    return [response.json(), response.status];
}

export async function CreateUser(username, password, email, admin, createUser, createOrder, produceOrder, approve, completedOrders) {
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
            createUser: createUser,
            createOrder: createOrder,
            produceOrder: produceOrder,
            approve: approve,
            completedOrders: completedOrders
        })
    });

    return [response.json(), response.status];
}

export async function GetUserLogs(userId) {
    const response = await fetch(`/api/user/userlogs/${userId}`);
    return response.json();
}