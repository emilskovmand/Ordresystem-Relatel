import { useState, useEffect, useRef, Fragment } from 'react'
import { GetUserList, UpdateUserRoles, UpdateOwnUser } from '../../services/userService'
import { useAPINotifier } from '../context/MessageReceiver'
import { useAuth } from '../context/auth'
import ReactLoading from 'react-loading'
import NewUserModal from './createUser'
import UserLogs from './UserLogs'

function AdminRow({ dbid, userName, mail = "", admin = false, createUser = false, createOrder = false, produce = false, approve = false, complete = false, toggleLogs }) {
    const [changed, setChanged] = useState(false);

    const inputs = useRef({});
    const { AddMessage } = useAPINotifier();

    const confirmSave = () => {

        if (!changed) return;
        else {
            setChanged(false);
        }

        UpdateUserRoles(
            dbid,
            inputs.current.admin.checked,
            inputs.current.createUser.checked,
            inputs.current.create.checked,
            inputs.current.produce.checked,
            inputs.current.approve.checked,
            inputs.current.complete.checked
        ).then((res) => {
            res[0].then((val) => {
                AddMessage(val, res[1]);
            })
        });
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
                        <input id="checkAdmin" ref={input => inputs.current.admin = input} onChange={() => setChanged(true)} type="checkbox" defaultChecked={admin} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkAdmin" ref={input => inputs.current.createUser = input} onChange={() => setChanged(true)} type="checkbox" defaultChecked={createUser} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkCreate" ref={input => inputs.current.create = input} onChange={() => setChanged(true)} type="checkbox" defaultChecked={createOrder} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkProduce" ref={input => inputs.current.produce = input} onChange={() => setChanged(true)} type="checkbox" defaultChecked={produce} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkApprove" ref={input => inputs.current.approve = input} onChange={() => setChanged(true)} type="checkbox" defaultChecked={approve} />
                    </div>
                </td>
                <td>
                    <div className="center">
                        <input id="checkComplete" ref={input => inputs.current.complete = input} onChange={() => setChanged(true)} type="checkbox" defaultChecked={complete} />
                    </div>
                </td>
                <td>
                    <button onClick={() => confirmSave()} className="SaveButton">Gem ændringer</button>
                </td>
                <td>
                    <button onClick={() => toggleLogs(dbid, userName)} className="logButton">Se logs</button>
                </td>
            </tr>
        </>
    )
}


export default function ConfigPage() {
    let auth = useAuth();

    const [showModal, setModal] = useState(false);
    const [Logs, setLogs] = useState({ active: false });
    const [data, setData] = useState(null);
    const [editUser, setEdituser] = useState(false);
    const { AddMessage } = useAPINotifier();

    const editUserButton = useRef();
    const editUserInputs = useRef({});

    const toggleEditUser = () => {
        if (editUser) {
            if (editUserInputs.current.newPassword.value === editUserInputs.current.repeatPassword.value && editUserInputs.current.newPassword.value.length > 7) {

                UpdateOwnUser(
                    auth.user.user._id,
                    editUserInputs.current.email.value,
                    editUserInputs.current.newPassword.value
                ).then((res) => {
                    res[0].then((val) => {
                        AddMessage(val, res[1]);
                    })
                });

                setEdituser(false);
            }
        } else {
            setEdituser(true);
        }
    }

    const setParentModalState = (val) => {
        setModal(val);
    }

    const setLogModalState = (userId, userName, active = false) => {
        setLogs({ userId: userId, userName: userName, active: active });
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
            {Logs.active && <UserLogs userId={Logs.userId} userName={Logs.userName} setLogModal={() => setLogModalState({ active: false })} />}
            <main id="config-page">
                <div className="myuserContainer">
                    <div id="myUser">
                        <div className="Userwrapper">
                            <div className="userinfoContainer">
                                {!editUser && <>
                                    <p><span className="greyout">Brugernavn:</span> {auth.user.user.username}</p>
                                    <p><span className="greyout">E-mail:</span> {auth.user.user.email}</p>
                                </>}
                                {editUser && <>
                                    <p><span className="greyout">Brugernavn:</span> {auth.user.user.username}</p>
                                    <label className="greyout">E-mail: </label>
                                    <input ref={input => editUserInputs.current.email = input} defaultValue={auth.user.user.email} />
                                </>}
                            </div>
                            <div className="passwordContainer">
                                {!editUser && <>
                                    <p><span className="greyout">Kodeord:</span> *********</p>
                                </>}
                                {editUser && <>
                                    <label className="greyout">Nyt Kodeord: </label>
                                    <input ref={input => editUserInputs.current.newPassword = input} type="password" />
                                    <label className="greyout">Gentag nyt kodeord: </label>
                                    <input ref={input => editUserInputs.current.repeatPassword = input} type="password" />
                                </>}
                            </div>
                            <div className="rolesContainer">
                                <p className="roles">Bruger roller</p>
                                <p>
                                    {ownRoles()}
                                </p>
                            </div>
                        </div>
                        <button className="editMyUser" onClick={toggleEditUser} ref={button => editUserButton.current = button}>
                            {!editUser && <>Rediger bruger</>}
                            {editUser && <>Gem ændringer</>}
                        </button>
                    </div>
                </div>
                {(auth.user.user.permissions["admin"] || auth.user.user.permissions["createUser"]) && <>
                    <div className="adminButtons">
                        <button className="newUser" onClick={() => setParentModalState(true)}>Ny Bruger</button>
                    </div>
                </>}
                {auth.user.user.permissions["admin"] && <>
                    <div className="userlistContainer">
                        <table className="content-table info">
                            <thead>
                                <tr>
                                    <th>Brugernavn</th>
                                    <th>E-mail</th>
                                    <th>Administrator</th>
                                    <th>Skab Bruger</th>
                                    <th>Skab Ordre</th>
                                    <th>Producer</th>
                                    <th>Godkender</th>
                                    <th>Se færdige ordre & Papirkurv</th>
                                    <th></th>
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
                                        createUser={(value.permissions.createUser != undefined) ? value.permissions.createUser : false}
                                        approve={value.permissions.approve}
                                        complete={value.permissions.complete}
                                        toggleLogs={(id, userName) => setLogModalState(id, userName, true)}
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