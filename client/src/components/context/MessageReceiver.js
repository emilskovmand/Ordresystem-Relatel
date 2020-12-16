import React, { useState, useCallback, useContext } from 'react'

export const APIContext = React.createContext({
    message: null,
    AddMessage: () => { },
    RemoveMessage: () => { }
})

export function APIMessageNotification() {
    const { message, RemoveMessage } = useAPINotifier();

    const handleSubmit = () => {
        RemoveMessage();
    }

    return (
        <>
            {message && <div className={"globalNotification " + (message.status === 200 ? "status200" : "statusError")}>
                <div className={"iconContainer " + (message.status === 200 ? "status200" : "statusError")}>
                    {message.status !== 200 && <i className="fas fa-times-circle fa-2x"></i>}
                    {message.status === 200 && <i className="fas fa-check-circle fa-2x"></i>}
                </div>
                <div className={"messageContainer " + (message.status === 200 ? "status200" : "statusError")}>
                    <p>{message.message}</p>
                    <button className={(message.status === 200 ? "status200" : "statusError")} onClick={() => handleSubmit()}>Forstået.</button>
                </div>
            </div>}
        </>
    )
}

export const useAPINotifier = () => {
    return useContext(APIContext);
}

export function APIMessageProvider({ children }) {
    const [message, setMessage] = useState(null);

    const addMessage = (message, status) => setMessage({ message: message, status: status })
    const removeMessage = () => setMessage(null);

    const contextValue = {
        message,
        AddMessage: (message, status) => addMessage(message, status),
        RemoveMessage: () => removeMessage()
    }

    return (
        <APIContext.Provider value={contextValue}>
            {children}
        </APIContext.Provider>
    )
}