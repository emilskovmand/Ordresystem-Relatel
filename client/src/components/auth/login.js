import { useState, useRef } from 'react';
import { AuthLogin } from '../../services/userService'
import { useAuth } from '../context/auth'
import { useHistory } from 'react-router-dom'
import { useAPINotifier } from '../context/MessageReceiver'
import { ListenForKey } from '../../services/orderService'

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const { AddMessage } = useAPINotifier();

    const rememberMe = useRef();

    let history = useHistory();
    let auth = useAuth();

    const handleLogin = async () => {
        if (password.length > 0 && username.length > 0) {
            let answer = await AuthLogin(username, password);

            if (answer === "No user Exists") {
                AddMessage("Couldn't authenticate user.", 500);
            } else {
                AddMessage(`Authenticated user: ${username}`, 200);
            }

            if (rememberMe.current.checked) {
                auth.memorySignin(() => {
                    history.replace('/');
                })
            } else {
                auth.signin(() => {
                    history.replace('/');
                });
            }
        }
    }

    return (
        <>
            <div id="login">
                <div className="form-container">
                    <div></div>
                    <h1>Velkommen</h1>
                    <div className="form">
                        <input onKeyDown={(ev) => ListenForKey(ev, 'Enter', handleLogin)} id="usernameField" className="credential" type="text" maxLength={60} placeholder="Username" onChange={e => setUsername(e.target.value)} />
                        <input onKeyDown={(ev) => ListenForKey(ev, 'Enter', handleLogin)} id="passwordField" className="credential" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        <input ref={input => rememberMe.current = input} type="checkbox" defaultChecked /> <p>Husk mig</p>
                        <button onClick={handleLogin} type="submit" id="login-button">Login</button>
                    </div>
                    <a href="/forgotpassword">
                        <p>Har du glemt dit kodeord?</p>
                    </a>
                </div>
            </div>
        </>
    )
}