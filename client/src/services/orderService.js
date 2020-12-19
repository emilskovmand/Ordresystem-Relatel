
export async function CreateOrder(OrdreId, Bestillingsdato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status = "Ny Ordre") {

    const load = {
        OrdreId: parseInt(OrdreId),
        Bestillingsdato: Bestillingsdato,
        Virksomhed: Virksomhed,
        Kundenavn: Kundenavn,
        AntalIndtalinger: AntalIndtalinger,
        ValgteSpeaker: ValgteSpeaker,
        Status: Status
    }

    const response = await fetch('/api/order/createOrder', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(load)
    });

    return [response.json(), response.status];
}

export function searchFilter(criteria, row) {
    if (/^\d+$/.test(criteria)) {
        if (row.OrdreId === parseInt(criteria)) {
            return true
        } else {
            return false;
        }
    } else if (criteria.length > 0) {
        criteria = criteria.toLowerCase();
        if (row.Virksomhed.toLowerCase().includes(criteria) || row.Kundenavn.toLowerCase().includes(criteria) || row.ValgteSpeaker.toLowerCase().includes(criteria)) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

export async function UpdateSingleOrder(_id, OrdreId, Bestillingsdato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status, Slettet = false) {

    const load = {
        OrdreId: parseInt(OrdreId),
        Bestillingsdato: Bestillingsdato,
        Virksomhed: Virksomhed,
        Kundenavn: Kundenavn,
        AntalIndtalinger: AntalIndtalinger,
        ValgteSpeaker: ValgteSpeaker,
        Status: Status,
        Slettet: Slettet
    }

    const response = await fetch(`/api/order/updateSingleOrder/${_id}`, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(load)
    });

    return [response.json(), response.status];
}

export async function DeleteOrders(_ids) {
    const response = await fetch(`/api/order/delete`, {
        method: 'DELETE',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleteList: _ids })
    });

    return [response.json(), response.status];
}

export async function getOrderId() {
    const response = await fetch(`/api/order/newid`);
    return response.json();
}

export async function GetOrders(status) {
    const response = await fetch(`/api/order/statusOrders/${status}`)
    return response.json();
}

export async function GetDeletedOrders() {
    const response = await fetch(`/api/order/deleted`);
    return response.json();
}

export async function DeleteOrderFromSystem(_ids) {
    const response = await fetch(`/api/order/permanentlyDelete`, {
        method: 'DELETE',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleteList: _ids })
    });

    return [response.json(), response.status];
}

export async function GetComments(_orderId) {
    const response = await fetch(`/api/order/comments/${_orderId}`);
    return response.json();
}

export async function AddComment(_orderId, text) {
    const response = await fetch(`/api/order/addcomment/${_orderId}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    });

    return [response.json(), response.status];
}