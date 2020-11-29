import { useState } from 'react';
import { AuthLogin } from '../../services/userService'
import { useAuth } from '../context/auth'
import { useHistory } from 'react-router-dom'

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    let history = useHistory();
    let auth = useAuth();

    let { from } = { from: { pathname: "/" } };

    const handleLogin = async () => {
        if (password.length > 0 && username.length > 0) {
            await AuthLogin(username, password);

            auth.signin(() => {
                history.replace(from);
            });
        }
    }

    return (
        <>
            <div id="login">
                <div className="form-container">
                    <div></div>
                    <h1>Velkommen</h1>
                    <div className="form">
                        <input id="usernameField" type="text" maxLength={60} placeholder="Username" onChange={e => setUsername(e.target.value)} />
                        <input id="passwordField" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
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