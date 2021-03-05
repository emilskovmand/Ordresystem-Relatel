import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth'
import { OrderCount } from '../../services/orderService'

export default function Navigation() {
    let auth = useAuth();
    const [Order, setOrderCount] = useState({ nyeOrdre: 0, underProduktion: 0, GodkendProduktion: 0, FærdigeOrder: 0, PapirKurv: 0 })

    const handleLogout = () => {
        auth.signout(() => {
            fetch('/api/user/logout');
        })
    }

    useEffect(() => {
        OrderCount().then((response) => {
            setOrderCount(response);
        })
        return () => {

        }
    }, [])

    return (
        <>
            <div className="sidebar">
                <img className="logo" src="/relatel_logo.png" alt="relatel_logo" />
                <h2>Ordresystem</h2>
                <ul>
                    <NavLink to='/' exact>
                        <li><p><i className="fas fa-medal"></i>Nye Ordre</p>
                            <div className="Count">{Order.nyeOrdre}</div>
                        </li>
                    </NavLink>
                    {auth.user && <>

                        {(auth.user.user.permissions["produce"] || auth.user.user.permissions["admin"]) && <NavLink to='/godkendt' exact>
                            <li><p><i className="fas fa-microphone-alt"></i>Under Produktion</p>
                                <div className="Count">{Order.underProduktion}</div>
                            </li>
                        </NavLink>}
                        {(auth.user.user.permissions["approve"] || auth.user.user.permissions["admin"]) && <NavLink to='/afventer' exact>
                            <li><p><i className="fas fa-assistive-listening-systems"></i>Godkend Produktion</p>
                                <div className="Count">{Order.GodkendProduktion}</div>
                            </li>
                        </NavLink>}
                        {(auth.user.user.permissions["complete"] || auth.user.user.permissions["admin"]) && <NavLink to='/færdigeordre' exact>
                            <li><p><i className="fas fa-check"></i>Færdige Ordre</p>
                                <div className="Count">{Order.FærdigeOrder}</div>
                            </li>
                        </NavLink>}
                        {/* <li><p><i class="fas fa-file-invoice"></i>Fakturering</p></li> */}
                        {(auth.user.user.permissions["complete"] || auth.user.user.permissions["admin"]) && <NavLink to='/papirkurv' exact>
                            <li><p><i className="fas fa-trash-alt"></i>Papirkurv</p>
                                <div className="Count">{Order.PapirKurv}</div>
                            </li>
                        </NavLink>}

                    </>}
                </ul>
                <div className="bottom_icons">
                    <NavLink to="/config" exact>
                        <i className="fas fa-user-cog"></i>
                    </NavLink>
                    <div id="logoutButton" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i></div>
                </div>
            </div>
        </>
    )
}