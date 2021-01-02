import { useState, useEffect, useRef, Fragment } from 'react'
import { GetOrders, searchFilter } from '../../services/orderService'
import OpenOrder from '../shared/openOrder'
import ReactLoading from 'react-loading'
import { useAuth } from '../context/auth'

function Row({ OrdreId, BestillingsDato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status, orderModal }) {
    return (
        <>
            <tr>
                <td>{OrdreId}</td>
                <td>{BestillingsDato.replace('T', " kl. ")}</td>
                <td className={(Virksomhed.length > 40) ? "break" : ""}>{Virksomhed}</td>
                <td className={(Kundenavn.length > 40) ? "break" : ""}>{Kundenavn}</td>
                <td>{AntalIndtalinger}</td>
                <td className={(ValgteSpeaker.length > 40) ? "break" : ""}>{ValgteSpeaker}</td>
                <td>{Status}</td>
                <td><button onClick={() => orderModal(arguments[0])} type="button" className="button">Åben Ordre</button></td>
            </tr>
        </>
    )
}

export default function FærdigeOrdre() {
    const [data, setData] = useState(null);
    const [openOrder, setOpenOrder] = useState({});
    const [searchCriteria, setSearchCriteria] = useState("");
    let auth = useAuth();

    const search = useRef();

    const editModal = (rowArguments = {}, empty = false) => {
        if (empty) {
            setOpenOrder({})
            return;
        }
        setOpenOrder(rowArguments);
    }

    const searchButton = (criteria) => {
        setSearchCriteria(criteria);
    }

    useEffect(() => {
        // effect
        GetOrders('Færdig%20&%20Sendt').then((response) => {
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
            />}
            <div className="main_content">
                <div className="header">Velkommen til ordresystemet. Du er logget ind som: {auth.user.user.username}</div>

                <h2 className="info">Færdige Ordre</h2>


                <input ref={input => search.current = input} type="text" className="selector move space" placeholder="Søgeord..." />
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
                            <th>Tidligere Status</th>
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