import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../components/context/auth'

export default function PrivateRoute({ children, exact = false, authed, permission = null, ...rest }) {
    let auth = useAuth();

    const handlePermission = () => {
        if (!permission) return true;
        else if (auth.user.user.permissions["admin"]) return true;
        else {
            return auth.user.user.permissions[permission];
        }
    }

    return (
        <Route {...rest} exact={exact} render={({ location }) => {
            return (auth.user != null && handlePermission())
                ? (
                    children
                )
                : (
                    <Redirect to={{
                        pathname: '/login',
                        state: { from: location }
                    }} />
                )
        }} />
    )
}