import { useState, useEffect, useRef, Fragment } from 'react'
import { GetOrders, searchFilter, DeleteOrders, ListenForKey } from '../../services/orderService'
import OpenOrder from '../shared/openOrder'
import ReactLoading from 'react-loading'
import { useAuth } from '../context/auth'
import { useAlertContext } from '../context/confirmAlert'

function Row({ OrdreId, dbId, BestillingsDato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status, orderModal, deleteRow, recordingId }) {

    const row = useRef();

    const deleteAction = () => {
        deleteRow(dbId, () => {
            row.current.style = "display: none;"
        });
    }

    return (
        <>
            <tr ref={tr => row.current = tr}>
                <td>{OrdreId}</td>
                <td>{BestillingsDato.replace('T', " kl. ")}</td>
                <td className={(Virksomhed.length > 40) ? "break" : ""}>{Virksomhed}</td>
                <td className={(Kundenavn.length > 40) ? "break" : ""}>{Kundenavn}</td>
                <td>{AntalIndtalinger}</td>
                <td className={(ValgteSpeaker.length > 40) ? "break" : ""}>{ValgteSpeaker}</td>
                <td>{Status}</td>
                <td><button onClick={() => orderModal(arguments[0])} type="button" className="button">Åben Ordre</button></td>
                <td><button onClick={() => deleteAction()} type="button" className="deleteRow" >Slet</button></td>
            </tr>
        </>
    )
}

export default function GodkendProduktion() {
    const [data, setData] = useState(null);
    const [openOrder, setOpenOrder] = useState({});
    const [searchCriteria, setSearchCriteria] = useState("");
    let auth = useAuth();
    const { AddAlert } = useAlertContext();

    const search = useRef();

    const editModal = (rowArguments = {}, empty = false) => {
        if (empty) {
            setOpenOrder({})
            return;
        }
        setOpenOrder(rowArguments);
    }

    const searchButton = (criteria = search.current.value) => {
        setSearchCriteria(criteria);
    }

    const deleteRow = (_id, cb) => {
        AddAlert("Er du sikker?", `Du er ved at slette en ordre fra "Godkend Produktion"`, () => {
            DeleteOrders([_id]);
            cb();
        });
    }

    useEffect(() => {
        // effect
        GetOrders('Godkend%20Produktion').then((response) => {
            setData(response);
        })

        return () => {
            // cleanup
        }
    }, [openOrder])

    return (
        <>
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
                recordingId={openOrder.recordingId}
            />}
            <div className="main_content">
                <div className="header">Velkommen til ordresystemet. Du er logget ind som: {auth.user.user.username}</div>

                <h2 className="info">Godkend Produktion</h2>

                <input ref={input => search.current = input} onKeyDown={(ev) => ListenForKey(ev, 'Enter', searchButton)} type="text" className="selector move space" placeholder="Søgeord..." />
                <button onClick={() => searchButton(search.current.value)} type="button" className="button">Søg</button>

                <table className="content-table info">
                    <thead>
                        <tr>
                            <th>Ordre ID</th>
                            <th>Bestillingsdato</th>
                            <th>Virksomhed</th>
                            <th>Kundenavn</th>
                            <th>Antal Indtalinger</th>
                            <th>Valgte Speaker</th>
                            <th>Status</th>
                            <th>Ordre Information</th>
                            <td></td>
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
                                    recordingId={(value.Recording ? value.Recording : null)}
                                    deleteRow={deleteRow}
                                />
                            }
                        })}
                    </tbody>
                </table>

                {!data && <ReactLoading className="loader" type={"spin"} color={"black"} height={50} width={50} />}

                <div className="info">
                    <div>Hvis du oplever nogle problemer eller har spørgsmål, så kontakt os venligst på telefon: 71 99 18 14
                    eller
                    email: kontakt@hejfrede.dk</div>
                </div>

            </div>
        </>
    )
}