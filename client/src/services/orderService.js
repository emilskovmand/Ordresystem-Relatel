
export async function CreateOrder(OrdreId, Bestillingsdato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, mail, sprog, indtalinger, Status = "Ny Ordre") {

    const load = {
        OrdreId: parseInt(OrdreId),
        Bestillingsdato: Bestillingsdato,
        Virksomhed: Virksomhed,
        Kundenavn: Kundenavn,
        AntalIndtalinger: AntalIndtalinger,
        ValgteSpeaker: ValgteSpeaker,
        Status: Status,
        indtalinger: indtalinger,
        mail: mail,
        sprog: sprog
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
};

export async function ApproveMultipleOrders(OrdreIds) {

    const response = await fetch('/api/order/massapprove', {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderIds: OrdreIds
        })
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
        if (row.Virksomhed.toLowerCase().includes(criteria)
            || row.Kundenavn.toLowerCase().includes(criteria)
            || row.ValgteSpeaker.toLowerCase().includes(criteria)
            || row.Sprog.toLowerCase().includes(criteria)
            || row.Mail.toLowerCase().includes(criteria)) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

export function ListenForKey(ev, keyName, cb) {
    if (ev.key === keyName) {
        cb();
    }
}

export async function UpdateSingleOrder(_id, OrdreId, Bestillingsdato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, mail, sprog, Status, Slettet = false, recordingsArray) {

    const load = {
        OrdreId: parseInt(OrdreId),
        Bestillingsdato: Bestillingsdato,
        Virksomhed: Virksomhed,
        Kundenavn: Kundenavn,
        AntalIndtalinger: AntalIndtalinger,
        ValgteSpeaker: ValgteSpeaker,
        Status: Status,
        Slettet: Slettet,
        recordingArrays: recordingsArray,
        sprog: sprog,
        mail: mail
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

export async function OrderCount() {
    const response = await fetch(`/api/order/count`);
    return response.json();
}