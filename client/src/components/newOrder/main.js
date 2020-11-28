import { Fragment, useState, useRef, useEffect } from 'react'
import { CreateOrder, GetOrders, searchFilter, getOrderId } from '../../services/orderService'
import OpenOrder from '../shared/openOrder'
import ReactLoading from 'react-loading'

function NewOrderModal({ setModal }) {

    const inputs = useRef([]);
    const errorBox = useRef();

    // Håndterer oprettelsen af ordre
    const handleOprettelse = () => {

        const notValidFields = [];
        // Check each field
        if (inputs.current.id.value.length === 0) {
            notValidFields.push("OrdreId");
        }
        if (inputs.current.virksomhed.value.length === 0) {
            notValidFields.push("Virksomhed");
        }
        if (inputs.current.kundenavn.value.length === 0) {
            notValidFields.push("Kundenavn");
        }
        if (inputs.current.indtalinger.value > 6) {
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
            CreateOrder(
                inputs.current.id.value,
                inputs.current.dato.value,
                inputs.current.virksomhed.value,
                inputs.current.kundenavn.value,
                inputs.current.indtalinger.value,
                inputs.current.speaker.value
            )
            setModal(false);
        }
    }

    // Dato format for input
    const dato = () => {
        const dateForDateTimeInputValue = date => new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 16);
        return dateForDateTimeInputValue(new Date());
    }

    const getId = async () => {
        return await getOrderId();
    }

    useEffect(() => {
        getId().then((val) => {
            inputs.current.id.value = val;
        });
        return () => {

        }
    }, [])

    return (
        <>
            <div id="newOrderModal" className="modal">
                <div className="modalContainer">
                    <section className="modal-context">
                        <h4>Opret ny ordre</h4>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="OrdreId">OrdreId</label>
                            </div>
                            <input ref={input => inputs.current.id = input} readOnly maxLength="8" name="OrdreId" type="text" defaultValue={"..."}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="Dato">BestillingsDato</label>
                            </div>
                            <input ref={input => inputs.current.dato = input} name="Dato" type="datetime-local" defaultValue={dato()}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="virksomhed">Virksomhed</label>
                            </div>
                            <input ref={input => inputs.current.virksomhed = input} name="virksomhed" type="text" placeholder=""></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="kunde">Kundenavn</label>
                            </div>
                            <input ref={input => inputs.current.kundenavn = input} name="kunde" type="text" placeholder=""></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="Indtalinger">Antal Indtalinger</label>
                            </div>
                            <input ref={input => inputs.current.indtalinger = input} name="Indtalinger" type="number" min="1" max="6" maxLength="2" defaultValue={1}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="speaker">Valgte Speaker</label>
                            </div>
                            <input ref={input => inputs.current.speaker = input} name="speaker" type="text" placeholder=""></input>
                        </div>

                        <p ref={p => errorBox.current = p} className="errorMessage"></p>

                        <div className="buttonsContainer">
                            <button onClick={() => handleOprettelse()} className="submitButton">
                                Opret Ordre
                            </button>
                            <button onClick={() => setModal(false)} className="cancelButton">
                                Annuller
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

function Row({ dbId, OrdreId, BestillingsDato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status, orderModal, checkBox }) {


    return (
        <>
            <tr id={dbId}>
                <td><input ref={input => checkBox(input)} type="checkbox" name="CheckBox" value={dbId} /></td>
                <td>{OrdreId}</td>
                <td>{BestillingsDato.replace('T', " kl. ")}</td>
                <td>{Virksomhed}</td>
                <td>{Kundenavn}</td>
                <td>{AntalIndtalinger}</td>
                <td>{ValgteSpeaker}</td>
                <td>{Status}</td>
                <td><button onClick={() => orderModal(arguments[0])} type="button" className="button">Åben Ordre</button></td>
            </tr>
        </>
    )
}

export default function NewOrder() {
    const [showModal, setModal] = useState(false);
    const [data, setData] = useState(null);
    const [openOrder, setOpenOrder] = useState({});
    const [searchCriteria, setSearchCriteria] = useState("");

    const checkBoxes = useRef([]);
    const search = useRef();

    const setParentModalState = (val) => {
        setModal(val);
    }

    const searchButton = (criteria) => {
        setSearchCriteria(criteria);
    }

    const editModal = (rowArguments = {}, empty = false) => {
        if (empty) {
            setOpenOrder({})
            return;
        }
        setOpenOrder(rowArguments);
    }

    const toggleMark = (input) => {
        for (let i = 0; i < checkBoxes.current.length; i++) {
            checkBoxes.current[i].checked = input.checked
        }
    }

    useEffect(() => {
        // Effect
        GetOrders('Ny%20Ordre').then((response) => {
            setData(response);
        })

        return () => {
            // Cleanup
        }
    },
        // Dependencies
        [showModal, openOrder])

    return (
        <Fragment>
            {showModal && <NewOrderModal setModal={setParentModalState} />}
            {Object.keys(openOrder).length > 0 && <OpenOrder
                _id={openOrder.dbId}
                OrdreId={openOrder.OrdreId}
                BestillingsDato={openOrder.BestillingsDato}
                Virksomhed={openOrder.Virksomhed}
                Kundenavn={openOrder.Kundenavn}
                AntalIndtalinger={openOrder.AntalIndtalinger}
                ValgteSpeaker={openOrder.ValgteSpeaker}
                Status={openOrder.Status}
                setEditState={editModal}
            />}
            <div className="main_content">
                <div className="header">Velkommen til ordresystemet. Du er logget ind som: Relatel</div>

                <h2 className="info">Nye Ordre</h2>
                <div>
                </div>
                <select className="info selector space">
                    <option style={{ display: "none" }} value="">--Massehandling--</option>
                    <option value="godkend">Godkend Valgte</option>
                    <option value="slet">Slet Alle</option>
                </select>
                <a className="space" href="google.dk"><button type="button" className="button">Anvend</button></a>

                <input ref={input => search.current = input} type="text" className="selector space" placeholder="Søgeord..." />
                <button onClick={() => searchButton(search.current.value)} type="button" className="button space">Søg</button>

                <button type="button" onClick={() => setModal(true)} className="button2 space">Opret Ny Ordre</button>

                <table className="content-table info">
                    <thead>
                        <tr>
                            <th><input type="CheckBox" onChange={(_) => toggleMark(_.target)} name="CheckAll" /> Vælg Alle</th>
                            <th>Ordre ID</th>
                            <th>Bestillingsdato</th>
                            <th>Virksomhed</th>
                            <th>Kundenavn</th>
                            <th>Antal Indtalinger</th>
                            <th>Valgte Speaker</th>
                            <th>Status</th>
                            <th>Ordre Information</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data && data.map((value, index) => {
                            if (searchFilter(searchCriteria, value) === false) return <Fragment key={index}></Fragment>;
                            else {
                                return <Row
                                    key={index}
                                    dbId={value._id}
                                    OrdreId={value.OrdreId}
                                    BestillingsDato={value.BestillingsDato}
                                    Virksomhed={value.Virksomhed}
                                    Kundenavn={value.Kundenavn}
                                    AntalIndtalinger={value.AntalIndtalinger}
                                    ValgteSpeaker={value.ValgteSpeaker}
                                    Status={value.Status}
                                    orderModal={editModal}
                                    checkBox={el => checkBoxes.current[index] = el}
                                />
                            }
                        })}
                    </tbody>

                </table>

                {!data && <ReactLoading className="loader" type={"spin"} color={"black"} height={50} width={50} />}

                <div className="info">
                    <div>Hvis du oplever nogle problemer eller har spørgsmål, så kontakt os venligst på telefon: 71 99 18 14 eller email: kontakt@hejfrede.dk</div>

                </div>

            </div>
        </ Fragment>
    )
}