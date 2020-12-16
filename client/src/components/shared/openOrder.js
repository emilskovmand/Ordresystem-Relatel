import { useState, useRef } from 'react'
import { UpdateSingleOrder, DeleteOrders, DeleteOrderFromSystem } from '../../services/orderService'
import { useAPINotifier } from '../context/MessageReceiver'

export default function OpenOrder({ _id, OrdreId, BestillingsDato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status, setEditState, editState, trashbin = false }) {
    const [closing, Close] = useState(false)
    const { AddMessage } = useAPINotifier();

    const inputs = useRef({});
    const errorBox = useRef();

    let newStatus = "";

    const closeAction = () => {
        Close(true);
        setTimeout(() => {
            setEditState({}, true)
        }, 350);
    }

    if (Status === "Ny Ordre") newStatus = "Under Produktion";
    else if (Status === "Under Produktion") newStatus = "Godkend Produktion";
    else if (Status === "Godkend Produktion") newStatus = "Færdig & Sendt";

    const updateOrder = async (orderStatus = Status) => {
        const notValidFields = [];
        // Check each field
        if (inputs.current.virksomhed.value.length === 0) {
            notValidFields.push("Virksomhed");
        }
        if (inputs.current.kundenavn.value.length === 0) {
            notValidFields.push("Kundenavn");
        }
        if (inputs.current.indtalinger.value > 6 || /[a-zA-Z]/g.test(inputs.current.indtalinger.value) || inputs.current.indtalinger.value.length === 0) {
            notValidFields.push("Antal Indtalinger")
        }
        if (inputs.current.speaker.value.length === 0) {
            notValidFields.push("Valgte Speaker");
        }

        // if any validation errors occured
        if (notValidFields.length > 0) {
            errorBox.current.innerText = "Ugyldige felter: " + notValidFields;
            errorBox.current.style = "display: block;"
            return;
        } else {

            UpdateSingleOrder(
                _id,
                OrdreId,
                inputs.current.dato.value,
                inputs.current.virksomhed.value,
                inputs.current.kundenavn.value,
                inputs.current.indtalinger.value,
                inputs.current.speaker.value,
                orderStatus
            ).then((res) => {
                res[0].then((val) => {
                    AddMessage(val, res[1]);
                })
            })

            closeAction();
        }
    }

    const remakeOrder = () => {
        UpdateSingleOrder(
            _id,
            OrdreId,
            inputs.current.dato.value,
            inputs.current.virksomhed.value,
            inputs.current.kundenavn.value,
            inputs.current.indtalinger.value,
            inputs.current.speaker.value,
            Status,
            false
        )
        closeAction();
    }

    const permanentlyDelete = () => {
        DeleteOrderFromSystem([_id]);
        closeAction();
    }

    const deleteOrder = () => {

        DeleteOrders([_id]);
        closeAction();
    }

    return (
        <>
            <div id="EditModal" className={`openOrder ${(closing) ? " close" : ""}`}>
                <div className="modalWrapper">
                    <div className={`modalContainer${(closing) ? " close" : ""}`}>
                        {!trashbin && <i id="trashcan" className="fa fa-trash" aria-hidden="true" onClick={() => deleteOrder()} ></i>}
                        <h4>OrdreId: {OrdreId}</h4>
                        <p>{_id}</p>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="Bestillingsdato">BestillingsDato</label>
                            </div>
                            <input ref={input => inputs.current.dato = input} name="Bestillingsdato" type="datetime-local" defaultValue={BestillingsDato}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="Virksomhed">Virksomhed</label>
                            </div>
                            <input ref={input => inputs.current.virksomhed = input} name="Virksomhed" type="text" defaultValue={Virksomhed}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="kundenavn">Kundenavn</label>
                            </div>
                            <input ref={input => inputs.current.kundenavn = input} name="kundenavn" type="text" defaultValue={Kundenavn}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="indtalinger">Antal Indtalinger</label>
                            </div>
                            <input ref={input => inputs.current.indtalinger = input} name="indtalinger" type="number" min="1" max="6" maxLength="2" defaultValue={AntalIndtalinger}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="valgteSpeaker">Valgte Speaker</label>
                            </div>
                            <input ref={input => inputs.current.speaker = input} name="valgteSpeaker" type="text" defaultValue={ValgteSpeaker}></input>
                        </div>

                        <div className="statusContainer">
                            <p>Nuværende status: <span className={Status.replace(/\s+/g, '').replace('&', '')}>{Status}</span></p>
                        </div>

                        <p ref={p => errorBox.current = p} className="errorMessage"></p>

                        {!trashbin && <div className="buttonsContainer">
                            {Status !== 'Færdig & Sendt' && <>
                                <button onClick={() => updateOrder(newStatus)} className="nextButton">
                                    {Status === "Ny Ordre" && <>Send til produktion</>}
                                    {Status === "Under Produktion" && <>Produceret</>}
                                    {Status === "Godkend Produktion" && <>Godkend</>}
                                </button>
                                <button onClick={() => updateOrder()} className="submitButton">
                                    Opdater Ordre
                            </button>
                            </>}
                            <button onClick={() => setEditState({}, false)} className={`cancelButton ${(Status === 'Færdig & Sendt') ? "closeButton" : ""}`}>
                                {Status === 'Færdig & Sendt' ? <>Luk</> : <>Annuller</>}
                            </button>
                        </div>}

                        {trashbin && <div className="buttonsContainer">
                            <button onClick={() => remakeOrder()} className="genskabButton">Genskab Ordre</button>
                            <button onClick={() => permanentlyDelete()} className="deleteButton">Slet Permanent</button>
                            <button onClick={() => setEditState({}, false)} className={`cancelButton`}>
                                Annuller
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}