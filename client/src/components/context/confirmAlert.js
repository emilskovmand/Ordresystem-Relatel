import React, { useState, useContext } from "react";

export const AlertContext = React.createContext({
    active: false,
    title: "No title",
    text: "No text",
    cb: () => { },
    AddAlert: () => { },
    RemoveAlert: () => { }
})

export function AlertUI() {
    const { alert, RemoveAlert } = useAlertContext();

    return (
        <>
            {alert && <> <div onClick={RemoveAlert} id="alertBackground"></div>
                <div id="confirmAlert">
                    <h1>{alert.title}</h1>
                    <p>{alert.text}</p>
                    <button className="alertYes"
                        onClick={() => {
                            alert.cb();
                            RemoveAlert();
                        }}
                    >Ja</button>
                    <button className="alertNo"
                        onClick={RemoveAlert}
                    >Nej</button>
                </div></>}
        </>
    )
}

export const useAlertContext = () => {
    return useContext(AlertContext);
}

export function AlertConfirmProvider({ children }) {
    const [alert, setAlert] = useState(null);

    const SetAlertControl = (title, text, callback) => {
        setAlert({
            active: true,
            title: title,
            text: text,
            cb: callback
        })
    }
    const removeAlert = () => setAlert(null);

    const contextValue = {
        alert,
        AddAlert: (title, text, callback) => SetAlertControl(title, text, callback),
        RemoveAlert: () => removeAlert()
    }

    return (
        <AlertContext.Provider value={contextValue}>
            { children}
        </AlertContext.Provider>
    )
}