

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

export async function GetOrders(status) {
    const response = await fetch(`/api/order/${status}`)
    return response.json();
}