

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

    await fetch('/api/order/createOrder', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(load)
    });
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

export async function UpdateSingleOrder(_id, OrdreId, Bestillingsdato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status) {

    const load = {
        OrdreId: parseInt(OrdreId),
        Bestillingsdato: Bestillingsdato,
        Virksomhed: Virksomhed,
        Kundenavn: Kundenavn,
        AntalIndtalinger: AntalIndtalinger,
        ValgteSpeaker: ValgteSpeaker,
        Status: Status
    }

    await fetch(`/api/order/updateSingleOrder/${_id}`, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(load)
    });
}

export async function DeleteOrders(_ids) {
    await fetch(`/api/order/delete`, {
        method: 'DELETE',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleteList: _ids })
    });
}

export async function getOrderId() {
    const response = await fetch(`/api/order/newid`);
    return response.json();
}

export async function GetOrders(status) {
    const response = await fetch(`/api/order/statusOrders/${status}`)
    return response.json();
}