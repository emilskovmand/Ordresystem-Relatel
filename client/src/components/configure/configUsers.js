import { useState, useEffect, useRef, Fragment } from 'react'
import { GetUserList, UpdateUserRoles } from '../../services/userService'
import { useAuth } from '../context/auth'
import ReactLoading from 'react-loading'
import NewUserModal from './createUser'

function AdminRow({ dbid, userName, mail = "", admin = false, createOrder = false, produce = false, approve = false, complete = false }) {

    const inputs = useRef({});

    const confirmSave = () => {

        if (inputs.current.admin.checked === admin && inputs.current.create.checked === createOrder && inputs.current.produce.checked === produce && inputs.current.approve.checked === approve && inputs.current.complete.checked === complete) return;

        UpdateUserRoles(
            dbid,
            inputs.current.admin.checked,
            inputs.current.create.checked,
            inputs.current.produce.checked,
            inputs.current.approve.checked,
            inputs.current.complete.checked
        )
    }

    return (
        <>
            <tr className="userRow">
                <td>{userName}</td>
                <td>
                    <a href={`mailto:${mail}`}>{mail}</a>
                </td>
                <td>
                    <div className="center">
                        <input id="checkAdmin" ref={input => inputs.current.admin = input} type="checkbox" defaultChecked={admin} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkCreate" ref={input => inputs.current.create = input} type="checkbox" defaultChecked={createOrder} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkProduce" ref={input => inputs.current.produce = input} type="checkbox" defaultChecked={produce} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkApprove" ref={input => inputs.current.approve = input} type="checkbox" defaultChecked={approve} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkComplete" ref={input => inputs.current.complete = input} type="checkbox" defaultChecked={complete} />
                    </div>
                </td>
                <td>
                    <button onClick={() => confirmSave()} className="SaveButton">Gem ændringer</button>
                </td>
            </tr>
        </>
    )
}


export default function ConfigPage() {
    let auth = useAuth();
    const [showModal, setModal] = useState(false);
    const [data, setData] = useState(null);


    const setParentModalState = (val) => {
        setModal(val);
    }

    const ownRoles = () => {
        const items = [];
        for (const permission in auth.user.user.permissions) {
            if (auth.user.user.permissions[permission] && permission === "admin") {
                items.push(<span key={permission}>Administrator</span>)
                break;
            } else if (auth.user.user.permissions[permission] && permission === "createOrder") {
                items.push(<span key={permission}>Skab ordre, </span>)
            } else if (auth.user.user.permissions[permission] && permission === "produce") {
                items.push(<span key={permission}>Producer, </span>)
            } else if (auth.user.user.permissions[permission] && permission === "approve") {
                items.push(<span key={permission}>Godkender, </span>)
            } else if (auth.user.user.permissions[permission] && permission === "complete") {
                items.push(<span key={permission}>Se færdige ordre & Papirkurv, </span>)
            }
        }

        return items;
    }

    useEffect(() => {
        // effect
        if (auth.user.user.permissions["admin"]) {
            GetUserList().then((response) => {
                setData(response);
            });
        }

        return () => {
            // cleanup
        }
    }, [showModal, auth])

    return (
        <>
            {showModal && <NewUserModal setModal={setParentModalState} />}
            <main id="config-page">
                <div className="myuserContainer">
                    <div id="myUser">
                        <div className="Userwrapper">
                            <div className="userinfoContainer">
                                <p><span className="greyout">Brugernavn:</span> {auth.user.user.username}</p>
                                <p><span className="greyout">E-mail:</span> </p>
                            </div>
                            <div className="passwordContainer">
                                <p><span className="greyout">Kodeord:</span> *********</p>
                            </div>
                            <div className="rolesContainer">
                                <p className="roles">Bruger roller</p>
                                <p>
                                    {ownRoles()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {auth.user.user.permissions["admin"] && <>
                    <div className="adminButtons">
                        <button className="newUser" onClick={() => setParentModalState(true)}>Ny Bruger</button>
                    </div>
                    <div className="userlistContainer">
                        <table className="content-table info">
                            <thead>
                                <tr>
                                    <th>Brugernavn</th>
                                    <th>E-mail</th>
                                    <th>Administrator</th>
                                    <th>Skab Ordre</th>
                                    <th>Producer</th>
                                    <th>Godkender</th>
                                    <th>Se færdige ordre & Papirkurv</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.map((value, index) => {
                                    return <AdminRow
                                        key={index}
                                        dbid={value._id}
                                        userName={value.username}
                                        mail={value.email}
                                        admin={value.permissions.admin}
                                        createOrder={value.permissions.createOrder}
                                        produce={value.permissions.produce}
                                        approve={value.permissions.approve}
                                        complete={value.permissions.complete}
                                    />
                                })}
                            </tbody>
                        </table>

                        {!data && <ReactLoading className="loader" type={"spin"} color={"black"} height={50} width={50} />}

                    </div>
                </>}
            </main>
        </>
    )
}