import { useState, useRef } from 'react'
import { CreateUser } from '../../services/userService'
import { useAPINotifier } from '../context/MessageReceiver'

export default function CreateUserModal({ setModal }) {
    const [closing, Close] = useState(false);
    const { AddMessage } = useAPINotifier();

    const inputs = useRef({});
    const errorBox = useRef();

    const closeAction = () => {
        Close(true);
        setTimeout(() => {
            setModal(false);
        }, 350);
    }

    const createUser = () => {
        const notValidFields = [];
        if (inputs.current.username.value.length <= 3) {
            notValidFields.push("Brugernavn")
        }
        if (inputs.current.password.value.length <= 7) {
            notValidFields.push("Kodeord")
        }

        // if any validation errors occured
        if (notValidFields.length > 0) {
            errorBox.current.innerText = "Ugyldige felter: " + notValidFields;
            errorBox.current.style = "display: block;"
            return;
        } else {
            CreateUser(
                inputs.current.username.value,
                inputs.current.password.value,
                inputs.current.mail.value,
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
            closeAction();
        }
    }


    return (
        <>
            <div id="NewUserModal" className={`${(closing) ? "close" : ""}`}>
                <section className="modalWrapper">
                    <div className={`modalContainer${(closing) ? " close" : ""}`} >
                        <h4>Skab ny bruger</h4>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="username">Brugernavn</label>
                            </div>
                            <input className="textField" id="username" ref={input => inputs.current.username = input} type="text" name="username"></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="password">Kodeord</label>
                            </div>
                            <input className="textField" id="password" ref={input => inputs.current.password = input} type="password" name="password"></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="mail">E-mail</label>
                            </div>
                            <input className="textField" id="mail" ref={input => inputs.current.mail = input} type="email" name="mail"></input>
                        </div>
                        <div className="inputField checkBoxField">
                            <input id="adminBox" name="adminBox" ref={input => inputs.current.admin = input} type="checkbox" defaultChecked={false} />
                            <label className="checkLabel" htmlFor="adminBox"><span>Administrator</span></label>
                        </div>
                        <div className="inputField checkBoxField">
                            <input id="createUserBox" name="adminBox" ref={input => inputs.current.createUser = input} type="checkbox" defaultChecked={false} />
                            <label className="checkLabel" htmlFor="createUserBox"><span>Skab bruger</span></label>
                        </div>
                        <div className="inputField checkBoxField">
                            <input id="createBox" name="adminBox" ref={input => inputs.current.create = input} type="checkbox" defaultChecked={true} />
                            <label className="checkLabel" htmlFor="createBox"><span>Skab ordre</span></label>
                        </div>
                        <div className="inputField checkBoxField">
                            <input id="ProduceBox" name="ProduceBox" ref={input => inputs.current.produce = input} type="checkbox" defaultChecked={true} />
                            <label className="checkLabel" htmlFor="ProduceBox"><span>Producer</span></label>
                        </div>
                        <div className="inputField checkBoxField">
                            <input id="approveBox" name="approveBox" ref={input => inputs.current.approve = input} type="checkbox" defaultChecked={true} />
                            <label className="checkLabel" htmlFor="approveBox"><span>Godkend</span></label>
                        </div>
                        <div className="inputField checkBoxField">
                            <input id="completeBox" name="completeBox" ref={input => inputs.current.complete = input} type="checkbox" defaultChecked={true} />
                            <label className="checkLabel" htmlFor="completeBox"><span>Se færdige ordre & Papirkurv</span></label>
                        </div>

                        <p ref={p => errorBox.current = p} className="errorMessage"></p>

                        <div className="buttonsContainer">
                            <button onClick={() => createUser()} className="createUserButton">Skab bruger</button>
                            <button onClick={() => closeAction()} className="cancelButton">Annuller</button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}