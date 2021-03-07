import { Fragment, useState, useRef, useEffect } from 'react'
import { CreateOrder, GetOrders, searchFilter, getOrderId, DeleteOrders, ApproveMultipleOrders, ListenForKey } from '../../services/orderService'
import { useAPINotifier } from '../context/MessageReceiver'
import OpenOrder from '../shared/openOrder'
import ReactLoading from 'react-loading'
import { useAuth } from '../context/auth'
import { useAlertContext } from '../context/confirmAlert'

function NewOrderModal({ setModal }) {
    const { AddMessage } = useAPINotifier();

    const [AudioCount, setAudioCount] = useState(1);
    const [loading, setLoading] = useState(false);

    const indtalingsBoxes = useRef([]);

    const inputs = useRef([]);
    const errorBox = useRef();
    let [givenId, setGivenId] = useState(0);

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
            // Show loader while creating order.
            setLoading(true);

            let indtalinger = [];
            for (let i = 0; i < indtalingsBoxes.current.length; i++) {
                indtalinger.push({ text: indtalingsBoxes.current[i].value });
            }

            CreateOrder(
                inputs.current.id.value,
                inputs.current.dato.value,
                inputs.current.virksomhed.value,
                inputs.current.kundenavn.value,
                inputs.current.indtalinger.value,
                inputs.current.speaker.value,
                inputs.current.mail.value,
                inputs.current.language.value,
                indtalinger
            ).then((res) => {
                res[0].then((val) => {
                    AddMessage(val, res[1]);
                    setModal(false);
                })
            });
        }
    }

    const updateAudioCount = () => {
        if (inputs.current.indtalinger.value <= 10) {
            setAudioCount(parseInt(inputs.current.indtalinger.value));
        } else {
            inputs.current.indtalinger.value = 10
        }
    }


    const readonly = (element) => {
        element.readOnly = true;
        element.value = givenId;
    }

    // Dato format for input
    const dato = () => {
        const dateForDateTimeInputValue = date => new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 16);
        return dateForDateTimeInputValue(new Date());
    }

    const getId = async () => {
        return await getOrderId();
    }

    const narrationComponents = (count) => {
        let array = [];
        for (let i = 0; i < count; i++) {
            array.push(<Fragment key={i}>
                <div className="Narrationcontainer">
                    <p>Indtalelse: {i + 1}</p>
                    <div className="textWrapper">
                        <textarea ref={text => indtalingsBoxes.current[i] = text}></textarea>
                    </div>
                </div>
            </Fragment>)
        }
        return array;
    }

    useEffect(() => {
        getId().then((val) => {
            inputs.current.id.value = val;
            setGivenId(val);
        });
        return () => {

        }
    }, [])

    return (
        <>
            <div id="newOrderModal" className="modal">
                {loading && <>
                    <div className="loaderWrapper">
                        <ReactLoading className="loader" type={"spin"} color={"black"} height={50} width={50} />
                        <h2>Creating order.</h2>
                    </div>
                </>}
                <div className={`modalContainer ${loading === true ? "hide" : ""}`}>
                    <section className={`modal-context`}>
                        <h4>Opret ny ordre</h4>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="OrdreId">OrdreId</label>
                            </div>
                            <input ref={input => inputs.current.id = input} readOnly onChange={(_) => readonly(_.target)} maxLength="8" name="OrdreId" type="text" defaultValue={"..."}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="Dato">BestillingsDato</label>
                            </div>
                            <input ref={input => inputs.current.dato = input} name="Dato" type="datetime-local" defaultValue={dato()}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="mail">Mail</label>
                            </div>
                            <input ref={input => inputs.current.mail = input} name="mail" type="text" placeholder=""></input>
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
                            <input ref={input => inputs.current.indtalinger = input} onChange={updateAudioCount} name="Indtalinger" type="number" min="1" max="10" maxLength="2" defaultValue={1}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="speaker">Vælg sprog</label>
                            </div>
                            <select ref={select => inputs.current.language = select} id="language" name="language" className="dropDown">
                                <option value="Engelsk" selected>Engelsk</option>¨
                                <option value="Dansk">Dansk</option>
                                <option value="Svensk">Svensk</option>
                                <option value="Norsk">Norsk</option>
                            </select>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="speaker">Valgte Speaker</label>
                            </div>
                            <input ref={input => inputs.current.speaker = input} name="speaker" type="text" placeholder=""></input>
                        </div>

                        <p ref={p => errorBox.current = p} className="errorMessage"></p>

                        <section id="newOrderAudioNarrationSection">
                            {narrationComponents(AudioCount)}
                        </section>

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

function Row({ dbId, OrdreId, BestillingsDato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status, orderModal, checkBox, deleteRow, Mail, Sprog, Comments, recordingId }) {

    const row = useRef();

    const deleteAction = () => {
        deleteRow(dbId, () => {
            row.current.style = "display: none;"
        });
    }

    return (
        <>
            <tr ref={tr => row.current = tr} id={dbId}>
                <td><input ref={input => checkBox(input)} type="checkbox" name="CheckBox" value={dbId} /></td>
                <td>{OrdreId}</td>
                <td>{BestillingsDato.replace('T', " kl. ")}</td>
                <td className="mail"><a href={`mailto:${Mail}`}>{Mail}</a></td>
                <td className={(Virksomhed.length > 35) ? "break" : ""}>{Virksomhed}</td>
                <td className={(Kundenavn.length > 35) ? "break" : ""}>{Kundenavn}</td>
                <td>{AntalIndtalinger}</td>
                <td>{Sprog}</td>
                <td className={(ValgteSpeaker.length > 40) ? "break" : ""}>{ValgteSpeaker}</td>
                <td>{Status}</td>
                <td className="commentAmount"><div>{Comments}</div></td>
                <td><button onClick={() => orderModal(arguments[0])} type="button" className="button">Åben Ordre</button></td>
                <td><button onClick={() => deleteAction()} type="button" className="deleteRow" >Slet</button></td>
            </tr>
        </>
    )
}

export default function NewOrder() {
    const [showModal, setModal] = useState(false);
    const [data, setData] = useState(null);
    const [openOrder, setOpenOrder] = useState({});
    const [searchCriteria, setSearchCriteria] = useState("");
    let auth = useAuth();
    const { AddMessage } = useAPINotifier();
    const { AddAlert } = useAlertContext();

    const massActionSelect = useRef();
    const checkBoxes = useRef([]);
    const search = useRef();

    const setParentModalState = (val) => {
        setModal(val);
    }

    const searchButton = (criteria = search.current.value) => {
        setSearchCriteria(criteria);
    }

    const PerformMassAction = async () => {
        var performActionOnSelected = checkBoxes.current.filter(c => {
            if (c != null) {
                if (c.checked === true) return true;
            }
            return false;
        }).map((val, index) => val.value);
        // Godkend alle valgte ordre
        if (massActionSelect.current.value === "godkend") {
            await ApproveMultipleOrders(performActionOnSelected).then((res) => {
                res[0].then((val) => {
                    AddMessage(val, res[1]);
                })
            });

            GetOrders('Ny%20Ordre').then((response) => {
                setData(response);
            })
        }
        // Send alle valgte ordre til papirkurv
        else if (massActionSelect.current.value === "slet") {
            await DeleteOrders(performActionOnSelected).then((res) => {
                res[0].then((val) => {
                    AddMessage(val, res[1]);
                })
            });

            GetOrders('Ny%20Ordre').then((response) => {
                setData(response);
            })
        }

        for (let i = 0; i < checkBoxes.current.length; i++) {
            if (checkBoxes.current[i] != null) {
                checkBoxes.current[i].checked = false;
            }
        }
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

    const deleteRow = (_id, cb) => {
        AddAlert("Er du sikker?", `Du er ved at slette en ordre fra "Nye Ordre"`, () => {
            DeleteOrders([_id]);
            cb();
        });
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
                Mail={openOrder.Mail}
                Sprog={openOrder.Sprog}
                Kundenavn={openOrder.Kundenavn}
                AntalIndtalinger={openOrder.AntalIndtalinger}
                ValgteSpeaker={openOrder.ValgteSpeaker}
                Status={openOrder.Status}
                setEditState={editModal}
                recordingId={openOrder.recordingId}
            />}
            <div className="main_content">
                <div className="header">Velkommen til ordresystemet. Du er logget ind som: {auth.user.user.username}</div>

                <h2 className="info">Nye Ordre</h2>
                <div>
                </div>
                <select ref={massActionSelect} className="info selector space">
                    <option style={{ display: "none" }} value="">--Massehandling--</option>
                    <option value="godkend">Godkend Valgte</option>
                    <option value="slet">Slet Alle</option>
                </select>
                <button style={{ marginRight: "5px" }} type="button" onClick={() => {
                    if (massActionSelect.current.value) {
                        AddAlert("Er du sikker?", `Du er ved at udføre massehandling: "${massActionSelect.current.value}"!`, () => { PerformMassAction() })
                    }
                }} className="button">Anvend</button>

                <input ref={input => search.current = input} onKeyDown={(ev) => ListenForKey(ev, 'Enter', searchButton)} type="text" className="selector space" placeholder="Søgeord..." />
                <button onClick={() => searchButton(search.current.value)} type="button" className="button space">Søg</button>

                <button type="button" onClick={() => setModal(true)} className="button2 space">Opret Ny Ordre</button>

                <table className="content-table info">
                    <thead>
                        <tr>
                            <th><input type="CheckBox" onChange={(_) => toggleMark(_.target)} name="CheckAll" /> Vælg Alle</th>
                            <th>Ordre ID</th>
                            <th>Bestillingsdato</th>
                            <th>Mail</th>
                            <th>Virksomhed</th>
                            <th>Kundenavn</th>
                            <th>Antal Indtalinger</th>
                            <th>Sprog</th>
                            <th>Valgte Speaker</th>
                            <th>Status</th>
                            <th>#</th>
                            <th>Ordre Information</th>
                            <th></th>
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
                                    Mail={value.Mail}
                                    Sprog={value.Language}
                                    orderModal={editModal}
                                    Comments={value.CommentAmount}
                                    recordingId={(value.Recording ? value.Recording : null)}
                                    checkBox={el => checkBoxes.current[index] = el}
                                    deleteRow={deleteRow}
                                />
                            }
                        })}
                    </tbody>

                </table>

                {!data && <ReactLoading className="loader" type={"spin"} color={"black"} height={50} width={50} />}

                <div className="info">
                    <div>Hvis du oplever nogle problemer eller har spørgsmål, så kontakt os venligst på telefon: <a href="tek:+4571991814"></a> eller email: <a href="mailto:kontakt@telefonspeak.dk">kontakt@telefonspeak.dk</a></div>

                </div>

            </div>
        </ Fragment>
    )
}