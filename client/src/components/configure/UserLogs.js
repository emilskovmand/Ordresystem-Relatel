import { GetUserLogs } from '../../services/userService'
import ReactLoading from 'react-loading'
import { useEffect, useState } from 'react'

function Log({ operation = "No operation", action = "No action", username = "No username", userId, date = "No date" }) {

    return (
        <>
            <div className="Log">
                <div className="operation">
                    <span>{operation}</span>
                </div>
                <div className="underInfo">
                    <div className="username">{username}</div>
                    <div className="date">{date}</div>
                    <div className={`action`}>CRUD-OP: <span className={action}>{action}</span></div>
                </div>
            </div>
        </>
    )
}

export default function UserLogs({ userId, userName, setLogModal }) {
    const [Logs, SetLogs] = useState(null);

    useEffect(() => {
        GetUserLogs(userId).then(response => {
            SetLogs(response);
        })
        return () => {

        }
    }, [])

    return (
        <>
            <div id="logModal">
                <section className="modalWrapper">
                    <div className="modalContainer">
                        <h3>Logs for {userName}</h3>
                        <div className="logBox">
                            {Logs && Logs.map((log, index) => {
                                return <Log
                                    operation={log.operation}
                                    action={log.action}
                                    date={log.date}
                                    username={log.username}
                                    userId={log.userId}
                                />
                            })}

                            {!Logs && <>
                                <div className="loaderWrapper">
                                    <ReactLoading className="loader" type={"spin"} color={"black"} height={45} width={45} />
                                </div>
                            </>}
                        </div>
                        <button onClick={() => setLogModal()} className="closeButton">Luk</button>
                    </div>
                </section>
            </div>
        </>
    )
}