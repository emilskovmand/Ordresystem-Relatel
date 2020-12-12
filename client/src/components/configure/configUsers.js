import { useState, useEffect, useRef, Fragment } from 'react'
import { GetUserList } from '../../services/userService'
import { useAuth } from '../context/auth'
import ReactLoading from 'react-loading'
import NewUserModal from './createUser'

function Row({ userName, admin = false, createOrder = false, produce = false, approve = false, complete = false }) {

    return (
        <>
            <tr className="userRow">
                <td>{userName}</td>
                <td>
                    <div className="center">
                        <input id="checkAdmin" type="checkbox" defaultChecked={admin} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkCreate" type="checkbox" defaultChecked={createOrder} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkProduce" type="checkbox" defaultChecked={produce} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkApprove" type="checkbox" defaultChecked={approve} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkComplete" type="checkbox" defaultChecked={complete} />
                    </div>
                </td>
                <td>
                    <button className="SaveButton">Gem ændringer</button>
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

    useEffect(() => {
        // effect
        GetUserList().then((response) => {
            setData(response);
        });

        return () => {
            // cleanup
        }
    }, [showModal])

    return (
        <>
            {showModal && <NewUserModal setModal={setParentModalState} />}
            <main id="config-page">
                <div className="myuserContainer">
                    <div id="myUser">
                        <div className="wrapper">
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

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="adminButtons">
                    <button className="newUser" onClick={() => setParentModalState(true)}>Ny Bruger</button>
                </div>
                <div className="userlistContainer">
                    <table className="content-table info">
                        <thead>
                            <tr>
                                <th>Brugernavn</th>
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
                                return <Row
                                    userName={value.username}
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
            </main>
        </>
    )
}