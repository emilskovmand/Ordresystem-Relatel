import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/auth'

export default function Navigation() {
    let auth = useAuth();

    const handleLogout = () => {
        auth.signout(() => {
            fetch('/api/user/logout');
        })
    }

    return (
        <>
            <div className="sidebar">
                <img className="logo" src="/relatel_logo.png" alt="relatel_logo" />
                <h2>Ordresystem</h2>
                <ul>
                    <NavLink to='/' exact>
                        <li><p><i className="fas fa-medal"></i>Nye Ordre</p></li>
                    </NavLink>
                    <NavLink to='/godkendt' exact>
                        <li><p><i className="fas fa-microphone-alt"></i>Godkendt til Produktion</p></li>
                    </NavLink>
                    <NavLink to='/afventer' exact>
                        <li><p><i className="fas fa-assistive-listening-systems"></i>Godkend Produktion</p></li>
                    </NavLink>
                    <NavLink to='/færdigeordre' exact>
                        <li><p><i className="fas fa-check"></i>Færdige Ordre</p></li>
                    </NavLink>
                    {/* <li><p><i class="fas fa-file-invoice"></i>Fakturering</p></li> */}
                    <li><p><i className="fas fa-trash-alt"></i>Papirkurv</p></li>
                </ul>
                <div className="bottom_icons">
                    <a><i className="fas fa-user-cog"></i></a>
                    <a id="logoutButton" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i></a>
                </div>
            </div>
        </>
    )
}